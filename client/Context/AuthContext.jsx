// Context/AuthContext.jsx
import React, { createContext, useEffect, useRef, useState } from "react";
import api from "../src/api/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  // checkAuth fetches user details and **returns boolean**
  const checkAuth = async () => {
    if (!token) {
      setAuthUser(null);
      setLoading(false);
      return false;
    }
    try {
      const { data } = await api.get("/user/check");
      setAuthUser(data.user || null);
      setLoading(false);
      return true;
    } catch (err) {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setLoading(false);
      return false;
    }
  };

  // initialize socket safely: create with autoConnect=false, set auth, then connect
  const initSocket = (authToken, userId) => {
    // cleanup existing socket if any
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
      } catch (e) { /* ignore */ }
      socketRef.current = null;
    }

    // create socket but DON'T auto connect (prevent race)
    const s = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: { token: authToken },
      query: { userId },
    });

    // handlers
    s.on("connect", () => {
      setConnectionStatus("connected");
      console.log("socket connected", s.id);
    });

    s.on("disconnect", (reason) => {
      setConnectionStatus("disconnected");
      console.log("socket disconnected", reason);
    });

    s.on("reconnect_attempt", () => {
      setConnectionStatus("reconnecting");
    });

    s.on("connect_error", (err) => {
      console.error("socket connect_error", err?.message || err);
      // helpful toast only once
      toast.error("Socket connection error: " + (err?.message || "unknown"));
    });

    s.on("getOnlineUsers", (list) => {
      setOnlineUsers(Array.isArray(list) ? list : []);
    });

    // attach to ref and connect
    socketRef.current = s;
    socketRef.current.connect();
  };

  // Effect: when token and authUser present, init socket; otherwise cleanup
  useEffect(() => {
    if (token && authUser?._id) {
      initSocket(token, authUser._id);
    } else {
      // no token/user -> make sure socket is disconnected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setOnlineUsers([]);
      setConnectionStatus("disconnected");
    }

    // cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // Only re-run when token or authUser id changes
  }, [token, authUser?._id]);

  // login: returns { success: boolean, data?, error? }
  const login = async (endpoint, payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post(`/user/${endpoint}`, payload);

      if (!data?.token) {
        // unexpected response
        toast.error("Login responded without token");
        return { success: false, error: new Error("No token in response") };
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      // set axios header immediately so subsequent checkAuth uses it
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const ok = await checkAuth(); // will set authUser
      if (!ok) {
        return { success: false, error: new Error("Auth check failed after login") };
      }

      // At this point, the effect above will run and init socket
      toast.success(data.message || "Logged in");
      return { success: true, data };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "An error occurred.";
      toast.error(msg);
      return { success: false, error: err };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    socketRef.current?.emit("user:offline", { userId: authUser?._id });
    socketRef.current?.disconnect();
    socketRef.current = null;
    setOnlineUsers([]);
    toast.success("Logged out");
  };

  const updateProfile = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.put("/user/profile", payload);
      setAuthUser(data.user || authUser);
      toast.success("Profile updated");
      return { success: true, data };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      return { success: false, error: err };
    } finally {
      setAuthLoading(false);
    }
  };

  // run initial check on mount (token from localStorage)
  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        token,
        login,
        logout,
        updateProfile,
        loading,
        authLoading,
        onlineUsers,
        socketRef,
        connectionStatus,
        setAuthUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

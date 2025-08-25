import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [AuthUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if the user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/user/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Login function
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/user/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post("/api/user/logout");
      setAuthUser(null);
      setOnlineUser([]);
      setToken(null);
      axios.defaults.headers.common["token"] = null;
      socket?.disconnect();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/user/updateProfile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Connect socket
  // In your AuthContext.jsx file

const connectSocket = (userData) => {
  if (!userData || socket?.connected) return;

  const newSocket = io(backendUrl, {
    query: {
      userId: userData._id,
    },
  });

  // newSocket.connect(); // This line can be removed

  setSocket(newSocket);

  // Corrected event name to match the server
  newSocket.on("getOnlineUsers", (userIds) => {
    setOnlineUser(userIds);
  });
};

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    AuthUser,
    onlineUser,
    socket,
    axios,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

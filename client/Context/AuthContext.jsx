import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import this

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ hook

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  // 🔹 Login & Signup
  const login = async (endpoint, body) => {
    try {
      const { data } = await axios.post(`/api/user/${endpoint}`, body);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);

      // ✅ redirect after login/signup
      navigate("/");
    } catch (error) {
      console.error("Login/Signup failed:", error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/user/check");
      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login"); // ✅ redirect to login page
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/user/profile", body);
      setUser(data.user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export const AuthContext = createContext();

// Create an axios instance
const api = axios.create({
  baseURL: "/api"
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      delete api.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  const login = async (endpoint, body) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post(`/user/${endpoint}`, body);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/user/check");
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
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const updateProfile = async (body) => {
    setAuthLoading(true);
    try {
      const { data } = await api.put("/user/profile", body);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfile, loading, authLoading, AuthUser: user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
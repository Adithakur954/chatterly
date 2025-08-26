import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import apiClient , {setAuthToken} from "../src/api/axios"; // 👈 Import the shared client and setter

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // When the token changes, update it in the API client and local storage
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token); // 👈 Set token on the shared instance
      checkAuth();
    } else {
      localStorage.removeItem("token");
      setAuthToken(null); // 👈 Clear token on the shared instance
      setLoading(false);
    }
  }, [token]);

  const login = async (endpoint, body) => {
    setAuthLoading(true);
    try {
      const { data } = await apiClient.post(`/user/${endpoint}`, body); // 👈 Use shared client
      setToken(data.token); // This will trigger the useEffect above
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
      const { data } = await apiClient.get("/user/check"); // 👈 Use shared client
      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const updateProfile = async (body) => {
    setAuthLoading(true);
    try {
      const { data } = await apiClient.put("/user/profile", body); // 👈 Use shared client
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
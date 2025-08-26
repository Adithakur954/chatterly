import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import apiClient from "../src/api/axios";



export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { AuthUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ... (keep your socket.io useEffect hooks the same)

  const getUsers = async () => {
    if (!AuthUser) return; // Don't fetch if there's no user
    setLoading(true);
    try {
      // ✅ Now this call uses the shared client which has the auth token
      const { data } = await apiClient.get("/user/all");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // This error will now likely only happen for legitimate server issues
    } finally {
      setLoading(false);
    }
  };
  
  // ... (keep your other functions like getMessages and sendMessage the same, but ensure they also use `apiClient`)

  useEffect(() => {
    if (AuthUser) {
      getUsers();
    } else {
      // If user logs out, clear the user list
      setUsers([]);
    }
  }, [AuthUser]);
  
  // ... (keep the rest of the context the same)

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    onlineUsers,
    loading,
    sendMessage,
    getUsers // 👈 Expose getUsers so Login page can call it
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
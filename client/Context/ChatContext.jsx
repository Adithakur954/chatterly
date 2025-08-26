import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import axios from "axios";

export const ChatContext = createContext();

const api = axios.create({
  baseURL: "/api"
});

export const ChatProvider = ({ children }) => {
  const { AuthUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (AuthUser) {
      const newSocket = io("http://localhost:5000", {
        query: { userId: AuthUser._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [AuthUser]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        if (selectedUser?._id === newMessage.senderId) {
          setMessages((prev) => [...prev, newMessage]);
        } else {
          setUnseenMessages((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      });

      return () => socket.off("newMessage");
    }
  }, [socket, selectedUser]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/user/all");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (userId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/message/${userId}`);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId, message) => {
    try {
      const { data } = await api.post(`/message/send/${receiverId}`, { message });
      setMessages((prev) => [...prev, data]);
      socket.emit("sendMessage", { ...data, receiverId });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (AuthUser) {
      getUsers();
    }
  }, [AuthUser]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    onlineUsers,
    loading,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 
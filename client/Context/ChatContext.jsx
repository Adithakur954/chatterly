// Context/ChatContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../src/api/axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socketRef, authUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]); // current chat messages
  const [users, setUsers] = useState([]); // contacts
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({}); // { userId: true }
  const pendingLocalIds = useRef(new Set());

  // Fetch users
  const getUsers = async () => {
    try {
      const { data } = await api.get("/message/users");
      if (data?.success) {
        setUsers(Array.isArray(data.users) ? data.users : []);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (err) {
      toast.error("Could not load users");
    }
  };

  // Fetch messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await api.get(`/message/${userId}`);
      setMessages(Array.isArray(data?.message) ? data.message : []);
      setUnseenMessages((prev) => {
        const clone = { ...prev };
        delete clone[userId];
        return clone;
      });
    } catch {
      toast.error("Could not load messages");
    }
  };

  // Socket listeners (typing + incoming messages) — rely on socketRef from AuthContext
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const handleIncoming = (msg) => {
      const fromId = msg.from || msg.senderId;
      if (selectedUser?._id && fromId === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setUnseenMessages((prev) => ({ ...prev, [fromId]: (prev[fromId] || 0) + 1 }));
      }
    };

    const handleTyping = ({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (isTyping) next[userId] = true;
        else delete next[userId];
        return next;
      });
    };

    socket.on("chat:message", handleIncoming);
    socket.on("chat:typing", handleTyping);

    return () => {
      socket.off("chat:message", handleIncoming);
      socket.off("chat:typing", handleTyping);
    };
  }, [socketRef, selectedUser]);

  // Send message (optimistic UI)
  const sendMessage = async (payload) => {
    if (!selectedUser?._id) return toast.error("No conversation selected");
    // create a temporary local id for optimistic UI
    const localId = `local_${Date.now()}`;
    const optimisticMsg = {
      ...payload,
      _id: localId,
      senderId: authUser?._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    pendingLocalIds.current.add(localId);

    try {
      const { data } = await api.post(`/message/send/${selectedUser._id}`, payload);
      if (data?.success) {
        // Replace optimistic message with server message
        setMessages((prev) =>
          prev.map((m) => (m._id === localId ? { ...data.newMessage, status: "sent" } : m))
        );
        pendingLocalIds.current.delete(localId);
        // emit via socket to let others know (if server doesn't broadcast)
        socketRef.current?.emit("chat:message", data.newMessage);
      } else {
        throw new Error(data?.message || "Send failed");
      }
    } catch (err) {
      // mark as failed
      setMessages((prev) => prev.map((m) => (m._id === localId ? { ...m, status: "failed" } : m)));
      toast.error("Failed to send message");
    }
  };

  // Emit typing event
  const sendTyping = (toUserId, isTyping) => {
    socketRef.current?.emit("chat:typing", { to: toUserId, userId: authUser?._id, isTyping });
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        unseenMessages,
        typingUsers,
        getUsers,
        getMessages,
        sendMessage,
        sendTyping,
        setSelectedUser,
        setUnseenMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

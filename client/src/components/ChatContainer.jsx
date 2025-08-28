// src/components/ChatContainer.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatDate } from "../lib/util";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

function ChatContainer() {
  const scrollEnd = useRef(null);
  const { messages, selectedUser, getMessages, sendMessage, sendTyping, typingUsers } =
    useContext(ChatContext);
  const { authUser, onlineUsers, connectionStatus } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const typingTimeout = useRef(null);
  const [isTypingLocal, setIsTypingLocal] = useState(false);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    // scroll on message changes
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    await sendMessage({ text: trimmed });
    setInput("");
    setIsTypingLocal(false);
    sendTyping(selectedUser._id, false);
  };

  // handle typing debounce
  const handleTyping = (value) => {
    setInput(value);
    if (!selectedUser?._id) return;

    if (!isTypingLocal) {
      setIsTypingLocal(true);
      sendTyping(selectedUser._id, true);
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTypingLocal(false);
      sendTyping(selectedUser._id, false);
    }, 900);
  };

  // show typing indicator if selectedUser is typing
  const otherTyping = typingUsers[selectedUser?._id];

  // group messages by day (simple grouping)
  const grouped = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col" aria-live="polite">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt={`${selectedUser.name || selectedUser.fullName} avatar`}
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.name || selectedUser.fullName}
          {onlineUsers?.includes(selectedUser._id) && (
            <span className="ml-2 w-2 h-2 rounded-full bg-green-500" title="Online" />
          )}
        </p>

        <div className="text-xs text-gray-300 px-2">
          {connectionStatus === "connected" ? "Connected" : connectionStatus}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-6" role="log">
        {Object.keys(grouped).length === 0 && <p className="text-center text-gray-400">No messages yet</p>}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date} className="mb-4">
            <div className="text-center text-xs text-gray-400 mb-2">{date}</div>
            {msgs.map((msg, idx) => {
              const isMine = msg.senderId === authUser?._id;
              return (
                <div
                  key={msg._id || idx}
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <img
                      src={selectedUser.profilePic || assets.avatar_icon}
                      alt="sender"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}

                  <div>
                    {msg.image ? (
                      <img
                        src={msg.image}
                        alt="sent"
                        className="max-w-[230px] border border-gray-700 rounded-lg"
                      />
                    ) : (
                      <p
                        className={`p-2 max-w-[70%] md:text-sm font-light rounded-lg break-all ${
                          isMine ? "bg-violet-500/30 text-white" : "bg-gray-700/30 text-white"
                        }`}
                      >
                        {msg.text}
                      </p>
                    )}
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {formatDate(msg.createdAt)} {isMine && msg.status === "pending" && "• Sending"}
                      {isMine && msg.status === "failed" && "• Failed"}
                    </div>
                  </div>

                  {isMine && (
                    <img
                      src={authUser?.profilePic || assets.avatar_icon}
                      alt="you"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {otherTyping && <div className="text-sm italic text-gray-300">{selectedUser?.name || "User"} is typing…</div>}

        <div ref={scrollEnd} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 flex items-center gap-3">
        <div className="flex flex-1 items-center bg-gray-100/12 px-3 rounded-full">
          <input
            aria-label="Type a message"
            onChange={(e) => handleTyping(e.target.value)}
            value={input}
            type="text"
            placeholder="Type a message ..."
            className="flex-1 text-sm p-3 bg-transparent rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) { e.target.value = ""; return; }
            if (!file.type.startsWith("image/")) { toast.error("Choose an image"); e.target.value = ""; return; }
            const reader = new FileReader();
            reader.onloadend = async () => {
              await sendMessage({ image: reader.result });
            };
            reader.readAsDataURL(file);
            e.target.value = "";
          }} type="file" id="Image" accept="image/*" hidden />
          <label htmlFor="Image">
            <img src={assets.gallery_icon} className="w-5 mr-2 cursor-pointer" alt="Upload" />
          </label>
        </div>
        <button type="submit" aria-label="Send message">
          <img src={assets.send_button} className="w-7 cursor-pointer" alt="Send" />
        </button>
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
}

export default ChatContainer;

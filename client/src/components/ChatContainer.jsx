import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatDate } from "../lib/util";

function ChatContainer({ selectedUser, setSelectedUser }) {
  const scrollEnd = useRef();
  const [messages, setMessages] = useState(messagesDummyData);

  const MY_ID = "680f50e4f10f3cd2832ecf9"; // your id
  const isMineFn = (id) => String(id) === String(MY_ID);

  // auto-scroll to bottom when messages change
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return selectedUser ? (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={assets.profile_martin}
          alt="human"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.name || "Martin Johnson"}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Close chat"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg, index) => {
          const isMine = isMineFn(msg.senderId);

          return (
            <div
              key={index}
              className={`flex items-end gap-2 w-full ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              {/* Receiver Avatar */}
              {!isMine && (
                <img
                  src={assets.profile_martin}
                  alt="receiver"
                  className="w-7 h-7 rounded-full"
                />
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[70%] p-3 rounded-2xl text-white relative ${
                  isMine
                    ? "bg-violet-600 rounded-br-none text-right"
                    : "bg-zinc-700 rounded-bl-none text-left"
                }`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="sent-img"
                    className="rounded-lg max-w-[230px]"
                  />
                ) : (
                  <p className="break-words text-sm">{msg.text}</p>
                )}
                {/* timestamp */}
                <div className="text-[10px] text-gray-300 mt-1">
                  {formatDate(msg.createdAt)}
                </div>
              </div>

              {/* My Avatar */}
              {isMine && (
                <img
                  src={assets.avatar_icon}
                  alt="me"
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={scrollEnd} />
      </div>

      {/*chat area input*/}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
  <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
    <input 
      type="text" 
      placeholder="Send a message" 
      className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' 
    />
    <input 
      type="file" 
      id="image" 
      accept='image/png, image/jpeg' 
      hidden 
    />
    <label htmlFor="image">
      <img 
        src={assets.gallery_icon} 
        alt="" 
        className="w-5 mr-2 cursor-pointer" 
      />
    </label>
  </div>
  <img 
    src={assets.send_button} 
    alt="" 
    className="w-7 cursor-pointer" 
  />
</div>

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">
        chat anytime anywhere
      </p>
    </div>
  );
}

export default ChatContainer;

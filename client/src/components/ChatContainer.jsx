import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatDate } from '../lib/util';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';

function ChatContainer() {
  const { AuthUser } = useContext(AuthContext);
  const { selectedUser, setSelectedUser, messages, sendMessage } = useContext(ChatContext);
  const [messageText, setMessageText] = useState('');
  const scrollEnd = useRef(null);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() === '' || !selectedUser) return;
    sendMessage(selectedUser._id, messageText);
    setMessageText('');
  };

  if (!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt="" />
        <p className='text-lg font-medium text-white'>
          Select a user to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg">
      {/* Header */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover" />
        <p className='flex-1 text-lg text-white'>{selectedUser.name}</p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className='md:hidden w-7 cursor-pointer'
        />
        <img src={assets.help_icon} alt="Help" className='max-md:hidden w-5' />
      </div>

      {/* Chat Messages (This is the key fix) */}
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-end gap-2 mb-4 ${msg.senderId === AuthUser._id ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderId !== AuthUser._id && (
              <img
                src={selectedUser.profilePic || assets.avatar_icon}
                alt=""
                className='w-7 h-7 rounded-full object-cover self-start'
              />
            )}
            <div className={`flex flex-col ${msg.senderId === AuthUser._id ? 'items-end' : 'items-start'}`}>
              <p
                className={`p-2 max-w-xs md:max-w-md text-sm font-light rounded-lg break-words text-white ${
                  msg.senderId === AuthUser._id
                    ? 'bg-violet-500/50 rounded-br-none'
                    : 'bg-gray-700/50 rounded-bl-none'
                }`}
              >
                {msg.message}
              </p>
              <p className='text-gray-500 text-xs mt-1'>{formatDate(msg.createdAt)}</p>
            </div>
            {msg.senderId === AuthUser._id && (
              <img
                src={AuthUser.profilePic || assets.avatar_icon}
                alt=""
                className='w-7 h-7 rounded-full object-cover self-start'
              />
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input Area */}
      <form onSubmit={handleSendMessage} className='p-3 flex items-center gap-3 border-t border-stone-500'>
        <div className='flex flex-1 items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            type="text"
            placeholder='Type a message...'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className='flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400'
          />
          <input type="file" id="Image" accept='image/jpeg,image/png' hidden />
          <label htmlFor="Image">
            <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="Upload" />
          </label>
        </div>
        <button type="submit">
          <img src={assets.send_button} className='w-7 cursor-pointer' alt="Send" />
        </button>
      </form>
    </div>
  );
}

export default ChatContainer;
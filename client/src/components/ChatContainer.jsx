import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets';
import { formatDate } from '../lib/util';

function ChatContainer({ selectedUser, setSelectedUser }) {
  const scrollEnd = useRef(null);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesDummyData]); // Rerun when messages change

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col">
      {/*--header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover" />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className='md:hidden max-w-7 cursor-pointer'
        />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/**--chat messages */}
      <div className='flex-1 overflow-y-scroll p-3 pb-6'>
        {messagesDummyData.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.senderId !== selectedUser._id ? 'justify-start' : 'justify-end'}`}>
            {msg.senderId !== selectedUser._id && (
              <div className='text-center text-xs'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover' />
                <p className='text-gray-500'>{formatDate(msg.createdAt)}</p>
              </div>
            )}
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-2' />
            ) : (
              <p className={`p-2 max-w-[70%] md:text-sm font-light rounded-lg mb-2 break-all ${msg.senderId === selectedUser._id ? 'bg-violet-500/30 text-white rounded-br-none' : 'bg-gray-700/30 text-white rounded-bl-none'}`}>{msg.text}</p>
            )}
            {msg.senderId === selectedUser._id && (
              <div className='text-center text-xs'>
                <img src={assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover' />
                <p className='text-gray-500'>{formatDate(msg.createdAt)}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*bottom area */}
      <div className='p-3 flex items-center gap-3'>
        <div className='flex flex-1 items-center bg-gray-100/12 px-3 rounded-full'>
          <input type="text" placeholder='Type a message ...' className='flex-1 text-sm p-3 border-none bg-transparent rounded-lg outline-none text-white placeholder-gray-400' />
          <input type="file" name="" id="Image" accept='image/jpeg,image/png' hidden />
          <label htmlFor="Image"> <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="" /></label>
        </div>
        <img src={assets.send_button} className='w-7 cursor-pointer' alt="" />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium text-white'>
        Chat anytime, anywhere
      </p>
    </div>
  );
}

export default ChatContainer;
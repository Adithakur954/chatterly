import React, { useContext, useState, useEffect } from 'react'; // 👈 Import useState & useEffect
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { AuthUser, logout } = useContext(AuthContext);

  // ✅ Get users and onlineUsers from ChatContext
  const { users, onlineUsers, selectedUser, setSelectedUser, unseenMessages } = useContext(ChatContext);

  const [input, setInput] = useState(''); // ✅ Initialize with an empty string for searching

  // Filter out the current authenticated user from the list
  const otherUsers = users.filter(user => user._id !== AuthUser._id);

  const filteredUsers = input
    ? otherUsers.filter(user => user.name.toLowerCase().includes(input.toLowerCase())) // ✅ Use 'name' to match schema
    : otherUsers;

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 mt-5 px-4 py-3'>
          <img src={assets.search_icon} alt="search" className=' w-3 cursor-pointer' />
          <input 
            onChange={(e) => setInput(e.target.value)} 
            value={input}
            type="text" 
            className='bg-transparent border-none border-gray-600 outline-none text-sm placeholder:text-gray-500 pl-2' 
            placeholder='Search...' 
          />
        </div>
      </div>
      <div className='flex flex-col'>
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const unreadCount = unseenMessages[user._id] || 0;

          return (
            <div
              key={user._id} // ✅ Use user._id for the key
              className={`relative flex items-center gap-2 p-2 rounded-md hover:bg-[#282142] cursor-pointer ${selectedUser?._id === user._id ? 'bg-[#282142]' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative">
                <img src={user?.profilePic || assets.avatar_icon} alt={user.name} className='w-10 h-10 rounded-full object-cover' />
                {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>}
              </div>

              <div className='flex flex-col'>
                <p>{user.name}</p> {/* ✅ Use 'name' to match schema */}
                <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* ✅ Correctly display the unread message count */}
              {unreadCount > 0 && (
                <span className='absolute top-4 right-2 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center'>
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
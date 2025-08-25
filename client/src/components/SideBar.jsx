import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import assets, { userDummyData } from '../assets/assets';
import { AuthContext } from '../../Context/AuthContext';

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

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
          <input type="text" className='bg-transparent border-none border-gray-600 outline-none text-sm placeholder:text-gray-500 pl-2' placeholder='Search...' />
        </div>
      </div>
      <div className='flex flex-col'>
        {userDummyData.map((user, index) => (
          <div key={index} className={`relative flex items-center gap-2 p-2 rounded-md hover:bg-[#282142] ${selectedUser?._id === user._id ? 'bg-[#282142]' : ''}`} onClick={() => setSelectedUser(user)}>
            <img src={user?.profilePic || assets.avatar_icon} alt={user.name} className='w-10 h-10 rounded-full' />
            <div className='flex flex-col'>
              <p>{user.fullName}</p>
              {
                index > 2
                  ? <span className='font-semibold text-green-500 '>Online</span> :
                  <span className='text-sm text-gray-400'>Offline</span>
              }
            </div>
            {index > 2 && <span className='absolute top-4 right-2 text-xs h-4 w-4 text-green-400'>{index}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar;
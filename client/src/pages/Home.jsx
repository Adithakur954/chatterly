import React from 'react'
import ChatContainer from '../components/ChatContainer'
import RightSIdeBar from '../components/RightSIdeBar'
import SideBar from '../components/SideBar'

function Home() {
  const [selectedUser, setSelectedUser] = React.useState(null);

  return (
    <div className='h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-grey-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <SideBar />
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <RightSIdeBar selectedUser={selectedUser} />
      </div>
    </div>
  )
}

export default Home;
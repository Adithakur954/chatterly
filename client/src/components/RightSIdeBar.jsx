import React from 'react';
import useConversation from '../zustand/useConversation';

const RightSideBar = () => {
  const { selectedConversation } = useConversation();

  if (!selectedConversation) {
    return <div className="hidden md:block md:w-1/4 bg-gray-100 p-4"></div>;
  }

  return (
    <div className="hidden md:block md:w-1/4 bg-gray-100 p-4 border-l border-slate-500">
      <div className="flex flex-col items-center text-center">
        <img
          src={selectedConversation.profilePic || `https://avatar.iran.liara.run/public/boy?username=${selectedConversation.fullName}`}
          alt={`${selectedConversation.fullName}'s profile`}
          className="w-24 h-24 rounded-full mb-4 ring-2 ring-blue-500"
        />
        <h3 className="text-lg font-bold text-gray-800">{selectedConversation.fullName}</h3>
        <p className="text-sm text-gray-600">{selectedConversation.email}</p>
      </div>
    </div>
  );
};

export default RightSideBar;
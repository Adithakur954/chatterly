// src/components/RightSideBar.jsx
import React, { useContext } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";

const RightSideBar = ({ selectedUser }) => {
  const { logout } = useContext(AuthContext);

  if (!selectedUser) {
    return <aside className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden" />;
  }

  return (
    <aside className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        <h1 className="px-10 text-xl font-medium mx-auto">{selectedUser.name || selectedUser.fullName}</h1>
        <p className="px-10 text-center text-sm">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {imagesDummyData.map((url, idx) => (
            <button key={idx} onClick={() => window.open(url, "_blank")} className="cursor-pointer rounded overflow-hidden">
              <img src={url} alt={`media-${idx}`} className="h-full w-full object-cover rounded-md" />
            </button>
          ))}
        </div>
      </div>

      <button onClick={logout} className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full">
        Logout
      </button>
    </aside>
  );
};

export default RightSideBar;

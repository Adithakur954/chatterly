// src/components/SideBar.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";

const SideBar = () => {
  const { users, selectedUser, unseenMessages, getUsers, setSelectedUser } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUsers]);

  const filtered = (users || []).filter((u) => (u.name || u.fullName || "").toLowerCase().includes(query.toLowerCase()));

  return (
    <aside className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="Menu" className="max-h-5 cursor-pointer" />
            <div className="absolute top-full right-0 z-20 w-40 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm">Edit Profile</p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 mt-5 px-4 py-3">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search..." className="bg-transparent outline-none text-sm placeholder:text-gray-400 pl-2" />
        </div>
      </div>

      <nav className="flex flex-col" aria-label="Contacts">
        {filtered.length ? filtered.map((u) => (
          <button
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`relative flex items-center gap-2 p-2 mb-2 rounded-md hover:bg-[#282142] text-left ${selectedUser?._id === u._id ? "bg-[#282142]" : ""}`}
            aria-current={selectedUser?._id === u._id}
          >
            <img src={u.profilePic || assets.avatar_icon} alt={u.name || u.fullName} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-medium">{u.name || u.fullName}</p>
                {unseenMessages?.[u._id] ? <span className="text-xs bg-green-700 px-2 rounded-full">{unseenMessages[u._id]}</span> : null}
              </div>
              <div className="text-xs text-gray-400">{onlineUsers?.includes(u._id) ? "Online" : "Offline"}</div>
            </div>
          </button>
        )) : <p className="text-gray-400 px-2">No users found</p>}
      </nav>
    </aside>
  );
};

export default SideBar;

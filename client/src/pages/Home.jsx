// src/pages/Home.jsx
import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import { ChatContext } from "../../Context/ChatContext";

const Home = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="h-screen sm:px-[5%] sm:py-[3%] bg-[#0b0a16] text-white">
      <div className={`backdrop-blur-xl border-2 border-gray-700 rounded-2xl h-full grid ${selectedUser ? "grid-cols-1 md:grid-cols-[1fr_1.6fr_1fr]" : "grid-cols-1 md:grid-cols-2"}`}>
        <SideBar />
        <ChatContainer />
        <RightSideBar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Home;

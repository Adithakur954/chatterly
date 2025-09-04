import ChatContainer from "../components/ChatContainer.jsx";
import SideBar from "../components/SideBar.jsx";
import RightSideBar from "../components/RightSideBar.jsx";

const Home = () => {
  return (
    <div className="flex h-[85vh] w-full md:w-[80vw] lg:w-[70vw] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <SideBar />
      <ChatContainer />
      <RightSideBar />
    </div>
  );
};
export default Home;
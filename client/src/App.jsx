import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { useAuthContext } from "../Context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
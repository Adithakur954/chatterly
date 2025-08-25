import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../Context/AuthContext'






function App() {
  

  const{AuthUser} = useContext(AuthContext);

  return (
    <>
    <div className="bg-[url(./src/assets/bgImage.svg)] bg-contain">
    <Toaster/>
      <Routes>
        <Route path='/' element={AuthUser ? <Home/> : <Navigate to="/login"/>}/>
        <Route path='/login' element={!AuthUser ? <Login/> : <Navigate to="/"/>}/>
        <Route path='/profile' element={AuthUser ? <Profile/> : <Navigate to="/login"/>}/>
      </Routes>
      </div>
    </>
  )
}

export default App

import React, { useState } from 'react'
import assets from '../assets/assets';

function Login() {

  const [currentState, setCurrentState] = useState("signUp");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const SubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "signUp" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* -------- left -------- */}
      <div className='flex items-center flex-col'>
        <img src={assets.logo_icon} alt="" className='w-[min(30vw,250px)]' />
        <p className='text-white text-4xl'>Chatterly</p>
      </div>

      {/* -------- right -------- */}

      <form onSubmit={SubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currentState}
          {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />}
        </h2>
        {currentState === "signUp" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName}
            type="text" placeholder='FullName' className='p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500' />
        )}
        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Enter your Email' className='p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500' />
            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Enter your Password' className='p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </>
        )}

        {currentState === "signUp" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
            placeholder='Tell us about yourself' className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
        )}
        <button type='submit' className='py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer'>
          {currentState === "signUp" && isDataSubmitted ? "Create Account" : "Login"}
        </button>
        <div className='text-sm text-gray-300 flex items-center gap-2'>
          <input type="checkbox" name="" id="" />
          <p>Agree to terms and conditions</p>
        </div>
        <div className='flex flex-col gap-2 text-gray-200'>
          {currentState === "signUp" ? (
            <p>Already have an account? <span className='text-blue-500 cursor-pointer' onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false) }}>Login</span></p>
          ) : (
            <p>Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => setCurrentState("signUp")}>Sign Up</span></p>
          )}
        </div>
      </form>

    </div>
  )
}

export default Login

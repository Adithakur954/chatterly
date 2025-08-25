import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../Context/AuthContext';

function Login() {
  const [currentState, setCurrentState] = useState("signUp");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const { login } = useContext(AuthContext);

  const SubmitHandler = (e) => {
    e.preventDefault();
    // If it's the first step of signup, just show the next field
    if (currentState === "signUp" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // Handle form submission for both login and signup
    if (currentState === 'signUp') {
      login('signup', { email, name: fullName, password, bio });
    } else {
      login('login', { email, password });
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* -------- left -------- */}
      <div className='flex items-center flex-col'>
        <img src={assets.logo_icon} alt="Chatterly Logo" className='w-[min(30vw,250px)]' />
        <p className='text-white text-4xl'>Chatterly</p>
      </div>

      {/* -------- right -------- */}
      <form onSubmit={SubmitHandler} className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[min(90vw,400px)]'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState === "signUp" ? (isDataSubmitted ? "About You" : "Sign Up") : "Login"}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              className='w-5 cursor-pointer transform rotate-180'
              alt="Back"
            />
          )}
        </h2>

        {/* --- Fields for Step 1 (Name, Email, Password) --- */}
        {!isDataSubmitted && (
          <>
            {currentState === "signUp" && (
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                placeholder='Full Name'
                required
                className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Enter your Email'
              required
              className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Enter your Password'
              required
              className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </>
        )}

        {/* --- Field for Step 2 (Bio) --- */}
        {currentState === "signUp" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Tell us about yourself'
            className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24'
          />
        )}

        <button type='submit' className='py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-300'>
          {currentState === 'Login' ? 'Login' : isDataSubmitted ? 'Create Account' : 'Continue'}
        </button>

        <div className='text-sm text-gray-300 flex items-center gap-2'>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the terms and conditions</label>
        </div>

        <div className='flex flex-col gap-2 text-gray-200 text-center'>
          {currentState === "signUp" ? (
            <p>
              Already have an account?{' '}
              <span className='text-blue-400 cursor-pointer hover:underline' onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false); }}>
                Login
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span className='text-blue-400 cursor-pointer hover:underline' onClick={() => setCurrentState("signUp")}>
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;

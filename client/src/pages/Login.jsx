import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext'; // 👈 1. Import ChatContext
import toast from 'react-hot-toast';

function Login() {
  const [currentState, setCurrentState] = useState("signUp");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: ""
  });
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const { login, loading } = useContext(AuthContext);
  const { getUsers } = useContext(ChatContext); // 👈 2. Get the getUsers function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (currentState === "signUp" && !isDataSubmitted) {
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
      }
      setIsDataSubmitted(true);
      return;
    }

    if (currentState === 'signUp') {
      // Use the 'login' function for both login and signup as defined in AuthContext
      await login('signup', { email: formData.email, name: formData.fullName, password: formData.password, bio: formData.bio });
      // ✅ 3. After a successful signup, immediately fetch the updated user list
      await getUsers(); 
    } else {
      await login('login', { email: formData.email, password: formData.password });
    }
  };

  // ... keep the rest of your JSX form code the same
  return (
    <div className='min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col'>
      <div className='flex items-center flex-col'>
        <img src={assets.logo_icon} alt="Chatterly Logo" className='w-[min(30vw,250px)]' />
        <p className='text-white text-4xl'>Chatterly</p>
      </div>

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

        {!isDataSubmitted && (
          <>
            {currentState === "signUp" && (
              <input
                onChange={handleChange}
                name="fullName"
                value={formData.fullName}
                type="text"
                placeholder='Full Name'
                required
                className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            )}
            <input
              onChange={handleChange}
              name="email"
              value={formData.email}
              type="email"
              placeholder='Enter your Email'
              required
              className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              onChange={handleChange}
              name="password"
              value={formData.password}
              type="password"
              placeholder='Enter your Password'
              required
              className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {currentState === "signUp" && (
              <input
                onChange={handleChange}
                name="confirmPassword"
                value={formData.confirmPassword}
                type="password"
                placeholder='Confirm your Password'
                required
                className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            )}
          </>
        )}

        {currentState === "signUp" && isDataSubmitted && (
          <textarea
            onChange={handleChange}
            name="bio"
            value={formData.bio}
            placeholder='Tell us about yourself'
            className='p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24'
          />
        )}

        <button type='submit' disabled={loading} className='py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50'>
          {loading ? "Loading..." : (currentState === 'Login' ? 'Login' : isDataSubmitted ? 'Create Account' : 'Continue')}
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
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: null,
    profilePicPreview: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profilePic: null,
        profilePicPreview: user.profilePic || assets.avatar_icon
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePic: reader.result,
          profilePicPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        profilePic: formData.profilePic,
      });
      toast.success("Profile updated successfully!");
      navigate('/');
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={handleImageChange} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={formData.profilePicPreview} alt="" className={`w-12 h-12 rounded-full object-cover ${formData.profilePic ? "ring-2 ring-blue-500" : ""}`} />
            Upload a new Image
          </label>
          <input
            onChange={handleChange}
            name="name"
            value={formData.name}
            type="text"
            required
            placeholder='Your Name'
            className='p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <textarea
            onChange={handleChange}
            name="bio"
            value={formData.bio}
            required
            placeholder='Your Profile bio'
            className='p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows={4}
          ></textarea>
          <button type='submit' disabled={loading} className='bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full text-lg cursor-pointer disabled:opacity-50'>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
        <img src={user?.profilePic||assets.logo_icon} className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' alt="" />
      </div>
    </div>
  );
};

export default ProfilePage;
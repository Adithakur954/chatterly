// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, updateProfile, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", bio: "", profilePic: null, profilePicPreview: assets.avatar_icon });

  useEffect(() => {
    if (authUser) {
      setForm({
        name: authUser.name || "",
        bio: authUser.bio || "",
        profilePic: null,
        profilePicPreview: authUser.profilePic || assets.avatar_icon,
      });
    }
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Pick an image"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm((p) => ({ ...p, profilePic: reader.result, profilePicPreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authLoading) return;
    try {
      await updateProfile({ name: form.name, bio: form.bio, profilePic: form.profilePic });
      toast.success("Saved!");
      navigate("/");
    } catch {
      // handled by auth
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0a16] text-white">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl border border-gray-700 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form className="flex flex-col gap-5 p-8 flex-1" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold">Profile details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input id="avatar" hidden type="file" accept=".png,.jpg,.jpeg" onChange={handleImageChange} />
            <img src={form.profilePicPreview} alt="preview" className={`w-12 h-12 rounded-full object-cover ${form.profilePic ? "ring-2 ring-violet-500" : ""}`} />
            <span>Upload a new Image</span>
          </label>

          <input name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="p-2 bg-transparent border border-gray-600 rounded-md" required />
          <textarea name="bio" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} className="p-2 bg-transparent border border-gray-600 rounded-md" rows={4} required />
          <div className="flex gap-3">
            <button type="submit" disabled={authLoading} className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-full disabled:opacity-50">Save</button>
            <button type="button" onClick={() => navigate("/")} className="bg-gray-700 p-2 rounded-full">Cancel</button>
          </div>
        </form>

        <img src={authUser?.profilePic || assets.logo_icon} className="max-w-44 aspect-square rounded-full mx-10" alt="profile" />
      </div>
    </div>
  );
};

export default Profile;

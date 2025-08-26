import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/User.js";
import { hashPassword } from "../utils/hashpassword.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

// Signup Controller
export const signup = asyncHandler(async (req, res) => {
  const { email, name, password, profilePic, bio } = req.body;

  if (!email || !name || !password || !bio) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPass = await hashPassword(password);

  const newUser = await User.create({
    email,
    name,
    password: hashedPass,
    bio,
    profilePic: profilePic || null,
  });

  const token = generateToken(newUser._id);

  const userResponse = newUser.toObject();
  delete userResponse.password;

  res.status(201).json({
    message: "User created successfully",
    user: userResponse,
    token,
  });
});

// Login Controller
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    message: "Login successful",
    user: userResponse,
    token,
  });
});

// Check Auth
export const checkauth = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    message: "User is authenticated",
    user: req.user,
  });
});

// Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, profilePic } = req.body;
  const userId = req.user._id;

  try {
    let updatedUser;
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pics",
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio, profilePic: upload.secure_url },
        { new: true }
      ).select("-password");
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio },
        { new: true }
      ).select("-password");
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// (Keep all your existing code: signup, login, checkauth, updateProfile)

// ✅ Add this new function to get all users for the sidebar
export const getUsersForSidebar = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all users from the database, but exclude the current user's own ID from the list
    const allOtherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(allOtherUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/User.js";
import { hashPassword } from "../utils/hashpassword.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

// signup controller



export const signup = asyncHandler(async(req, res) =>{

    const { email, name, password, profilePic, bio } = req.body;

    if (!email || !name || !password || !bio) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPass = await hashPassword(password);

    const newUser = await User.create({
      email,
      name,
      password: hashPass,
      
      bio
    });

    const Token = generateToken(newUser._id);

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser, token: Token});
} )

export const login = asyncHandler(async(req, res) =>{
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

    const Token = generateToken(user._id);

    res.status(200).json({ message: "Login successful", user, token: Token });


})

export const checkauth = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({ message: "User is authenticated", user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, profilePic } = req.body;

  
const userId = req.user._id;

if(!profilePic)
{
    updatedUser = await User.findByIdAndUpdate(userId,{bio: bio, name: name},{ new: true});
}
else{
    const upload = await cloudinary.uploader.upload(profilePic);
    updatedUser = await User.findByIdAndUpdate(userId,{bio: bio, name: name, profilePic: upload.secure_url},{ new: true});
}

res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
});


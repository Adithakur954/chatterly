import User from '../model/User.js';
import Message from '../model/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const signup = asyncHandler(async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    if (newUser) {
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } else {
        res.status(400).json({ error: 'Invalid user data' });
    }
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
    });
});

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserForSideBar = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
        {
            $match: {
                $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ['$senderId', loggedInUserId] },
                        then: '$receiverId',
                        else: '$senderId'
                    }
                },
                lastMessage: { $first: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        },
        {
            $project: {
                _id: '$userDetails._id',
                fullName: '$userDetails.fullName',
                profilePic: '$userDetails.profilePic',
                lastMessage: {
                    message: '$lastMessage.message',
                    senderId: '$lastMessage.senderId',
                    createdAt: '$lastMessage.createdAt'
                }
            }
        }
    ]);

    res.status(200).json(conversations);
});
import Message from '../model/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
        senderId,
        receiverId,
        message,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
});

export const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: senderId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: senderId },
        ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
});
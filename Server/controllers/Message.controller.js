import Message from "../model/Message.js";
import User from "../model/User.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ Get all users for sidebar (exclude logged-in user)
export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get all messages between logged-in user & another user
export const getMessage = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const receiverId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId },
        { senderId: receiverId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;

    let imageUrl = "";
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Mark a message as seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { seen: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as seen",
      updatedMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

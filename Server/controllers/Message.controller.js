import Message from "../model/Message.js";
import User from "../model/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cloudinary from "../utils/cloudinary.js";
import { io, userSocketMap } from "../server.js";


export const getUserForSideBar = asyncHandler(async(req,res) =>{

    const filteredUser = await User.find({_id:{$ne: req.user._id}}).select("-password");

    const unseenMessages = {};
    const promises = filteredUser.map(async(value) =>{

        const message = await Message.find({senderId: value._id, receiverId: req.user._id, seen: false});
        if(message.length > 0) {
            unseenMessages[value._id] = message;
        }
    })

    await Promise.all(promises);
    res.json({success: true, data:filteredUser, unseenMessages})
})

// get all message for selected user

export const getMessage = asyncHandler(async(req,res) =>{

    const {id:selectedUserId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: selectedUserId },
            { senderId: selectedUserId, receiverId: myId }
        ]
    })

    await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true})

    res.json({ success: true, data: messages });
})

// api to mark messages as seen using message id 
export const markMessagesAsSeen = asyncHandler(async (req, res) => {
   
    const myId = req.user._id;

    await Message.findByIdAndUpdate(myId, { seen: true });
     res.json({ success: true });
});
// send to message 

export const sendMessage = asyncHandler(async(req,res) =>{

    const {text, image} = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl;
    if(image){
        const uploadResponse = await Cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url; 
    }

    const newMessage = await Message.create({
        text,
        image: imageUrl,
        senderId,
        receiverId
    })

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", newMessage);
    }

    res.json({ success: true,newMessage });

})
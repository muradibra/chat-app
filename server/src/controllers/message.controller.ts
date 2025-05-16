import { Request, Response } from "express";
import User from "../mongoose/schemas/user.model";
import Message from "../mongoose/schemas/message.model";
import cloudinary from "../utils/cloudinary";
import { getReceiverSocketId, io } from "../utils/socket";

const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;
    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password -__v");

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error in getUsersForSidebar controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log("Error in getMessages controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl = "";

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    res.status(200).json({
      message: "Message sent successfully",
      newMessage,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchUser = async (req: Request, res: Response) => {
  try {
    const { fullname } = req.query;
    const loggedInUserId = req.user?._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
      fullname: { $regex: fullname, $options: "i" },
    }).select("-password -__v");

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error in searchUser controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const messageController = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  searchUser,
};

export default messageController;

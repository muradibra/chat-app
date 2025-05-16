import { Request, Response } from "express";
import User from "../mongoose/schemas/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/token";
import cloudinary from "../utils/cloudinary";

const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      res.status(400).json({ message: "Please fill all fields" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    const user = await User.findOne({
      email,
    });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await User.create({
      email,
      password: hashPassword(password),
      fullname: fullname,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullname: newUser.fullname,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    if (!comparePassword(password, user.password)) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateToken(user._id.toString(), res);
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { profilePic } = req.body;

    if (!profilePic) {
      res.status(400).json({ message: "Please provide a profile picture" });
      return;
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser?._id,
        email: updatedUser?.email,
        fullname: updatedUser?.fullname,
        profilePic: updatedUser?.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in updateUser controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const check = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.log("Error in check controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const authController = {
  signup,
  login,
  logout,
  updateUser,
  check,
};

export default authController;

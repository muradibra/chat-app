import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullname: {
      type: String,
      required: true,
    },
    // username: {
    //   type: String,
    //   // required: true,
    //   unique: true,
    // },
    profilePic: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", user);

export default User;

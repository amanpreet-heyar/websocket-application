const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    messages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    image:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

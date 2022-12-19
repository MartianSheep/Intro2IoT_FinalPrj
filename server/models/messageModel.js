import mongoose from "mongoose";

const messageModel = mongoose.Schema({
  messageType: { type: Number, required: true },
  water: { type: Number },
  temperature: { type: Number },
  electricity: { type: Number },

  senderId: { type: String, required: true },
  path: { type: [String], required: true },

  // isValid: { type: Boolean, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

var MessageModel = mongoose.model("messages", messageModel);
export default MessageModel;

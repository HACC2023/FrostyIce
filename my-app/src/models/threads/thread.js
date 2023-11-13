import mongoose, { Schema } from "mongoose";
import Message from "./message";

const threadSchema = new Schema({
  eventId: {
    type: String,
    required: true,
    trim: true,
  },

  messages: {
    type: [Message],
    required: true,
    default: [],
  },
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;

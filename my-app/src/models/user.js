import mongoose, { Schema } from "mongoose";
import { ROLES } from "@/roles/roles";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String, 
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: Object.values(ROLES),
  },
  password: {
    type: String,
    required: true,
  },
  orgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

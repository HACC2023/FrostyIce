import mongoose, { Schema } from "mongoose";
import { ISLANDS, STORAGE_NODES } from "@/constants/constants";

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    enum: ISLANDS,
    required: true,
  },
  associatedNode: {
    type: String,
    enum: STORAGE_NODES,
    required: true,
  }
});

const Organization = mongoose.models.Organization ||mongoose.model("Organization", organizationSchema);
export default Organization;

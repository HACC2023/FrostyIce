import { DISPOSAL_MECHANISMS, ISLANDS, POLYMERS } from "@/constants/constants";
import mongoose from "mongoose";

const sortedMaterialSchema = new mongoose.Schema({
  material: {
    type: String,
    required: true,
  },
  island: {
    type: String,
    enum: ISLANDS,
    required: true,
  },
  mass: {
    type: Number,
    required: true,
  },
  polymer: {
    type: String,
    enum: POLYMERS,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  disposalDate: {
    type: Date,
  },
  disposalMechanism: {
    type: String,
    enum: DISPOSAL_MECHANISMS,
  },
});

const SortedMaterial =
  mongoose.models.SortedMaterial ||
  mongoose.model("SortedMaterial", sortedMaterialSchema);

export default SortedMaterial;

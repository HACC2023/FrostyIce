import { STORAGE_NODES } from "@/constants/constants";
import mongoose, { Schema } from "mongoose";

const multiEventTransportSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ["Scheduled", "Complete", "Cancelled"],
    default: "Scheduled",
  },
  shipmentDate: {
    type: Date,
    required: true,
  },
  fromNode: {
    type: String,
    enum: STORAGE_NODES,
    required: true,
  },
  eventIds: [{
    type: Schema.Types.ObjectId,
  }],
});

const MultiEventTransport = mongoose.models.MultiEventTransport || mongoose.model("MultiEventTransport", multiEventTransportSchema);

export default MultiEventTransport;

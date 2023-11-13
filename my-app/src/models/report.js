import mongoose, { Schema } from "mongoose";

const validTypes = ["Net", "Line", "dFAD"];

const eventReportSchema = new Schema({
  reportDate: {
    type: Date,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  publicDesc: {
    type: String,
    required: true,
    trim: true,
  },
  envDamage: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: validTypes,
  },
  approxSize: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});

const EventReport =
  mongoose.models.EventReport ||
  mongoose.model("EventReport", eventReportSchema);

export default EventReport;

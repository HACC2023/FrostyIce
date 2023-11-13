import mongoose from "mongoose";

const disposalMechanismSchema = new mongoose.Schema({
  repurposedForInfrastructure: {
    type: Number,
    default: 0.0,
  },
  repurposedForResearch: {
    type: Number,
    default: 0.0,
  },
  repurposedForAcademia: {
    type: Number,
    default: 0.0,
  },
  storedForFutureReuse: {
    type: Number,
    default: 0.0,
  },
  burnedForPower: {
    type: Number,
    default: 0.0,
  },
  landFill: {
    type: Number,
    default: 0.0,
  },
  burned: {
    type: Number,
    default: 0.0,
  },
  leftInEnvironment: {
    type: Number,
    default: 0.0,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  disposalDate: {
    type: Date,
  },
});

const DisposalMechanism = mongoose.models.DisposalMechanism || mongoose.model("DisposalMechanism", disposalMechanismSchema);

export default DisposalMechanism;

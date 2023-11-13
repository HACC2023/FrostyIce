import connectDB from "@/lib/mongodb";
import Event from "@/models/event";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "GET") {
      const event = await Event.findById(_id);
      res.status(200).json(event);
    }

    if (req.method === "PUT") {
      const {
        status, removalOrgId, removalStartDate, removalEndDate, debrisSize, debrisMass, tempStorage, assessedEnvDamage,
      } = await req.body;
      await Event.findByIdAndUpdate(_id, {
        status, removalOrgId, removalStartDate, removalEndDate, debrisSize, debrisMass, tempStorage, assessedEnvDamage,
      }, { runValidators: true });
      res.status(200).json(await Event.findById(_id));
    }

    if (req.method === "DELETE") {
      await Event.findByIdAndDelete(_id);
      res.status(200).json({ msg: "Event deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Helpful error message" });
  }
}

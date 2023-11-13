import connectDB from "@/lib/mongodb";
import Event from "@/models/event";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const { storageNode } = req.query;
      const events = await Event.find({ tempStorage: storageNode });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: "Helpful error message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

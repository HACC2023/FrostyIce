import connectDB from "@/lib/mongodb";
import MultiEventTransport from "@/models/multiEventTransport";

export default async function handler(req, res) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const event = await MultiEventTransport.find();
      res.status(200).json(event);
    }
  } catch (error) {
    res.status(500).json({ error: "Helpful error message" });
  }
}

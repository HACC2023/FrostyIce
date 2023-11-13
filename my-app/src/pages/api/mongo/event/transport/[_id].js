import connectDB from "@/lib/mongodb";
import MultiEventTransport from "@/models/multiEventTransport";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "GET") {
      const event = await MultiEventTransport.findById(_id);
      res.status(200).json(event);
    }

    if (req.method === "PUT") {
      const {
        status, shipmentDate, fromNode, eventIds,
      } = await req.body;
      await MultiEventTransport.findByIdAndUpdate(_id, {
        status, shipmentDate, fromNode, eventIds,
      }, { runValidators: true });
      res.status(200).json(await MultiEventTransport.findById(_id));
    }

    if (req.method === "DELETE") {
      await MultiEventTransport.findByIdAndDelete(_id);
      res.status(200).json({ msg: "Transport event deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Helpful error message" });
  }
}

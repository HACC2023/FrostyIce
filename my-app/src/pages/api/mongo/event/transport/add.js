import MultiEventTransport from "@/models/multiEventTransport";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { status, shipmentDate, fromNode, eventIds } = await req.body;
      await MultiEventTransport.create({ status, shipmentDate, fromNode, eventIds });
      res.status(201).json({ status, shipmentDate, fromNode, eventIds });
    } else {
      res.status(405).json({ msg: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Helpful error message" });
  }
}

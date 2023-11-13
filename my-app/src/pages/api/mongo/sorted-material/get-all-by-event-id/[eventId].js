import connectDB from "@/lib/mongodb";
import SortedMaterial from "@/models/sortedMaterial";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      await connectDB();
      const { eventId } = req.query;
      const sortedMaterials = await SortedMaterial.find({ eventId: eventId });
      // console.log("sortedMaterial ok", sortedMaterials.ok);
      // console.log("sortedMaterials", sortedMaterials);
      res.status(200).json(sortedMaterials);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Unable to fetch sortedMaterials." });
  }
}

import connectDB from "@/lib/mongodb";
import SortedMaterial from "@/models/sortedMaterial";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      await connectDB();
      console.log("sending req get sortedMaterials");
      const sortedMaterials = await SortedMaterial.find({});
      res.status(200).json(sortedMaterials);
    }

    if (req.method === "POST") {
      await connectDB();
      console.log("sending post request");
      const sortedMaterial = await SortedMaterial.create(req.body);
      console.log("sortedMaterial ok", sortedMaterial.ok);
      res.status(200).json(sortedMaterial);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Unable to fetch sortedMaterials." });
  }
}

import connectDB from "@/lib/mongodb";
import SortedMaterial from "@/models/sortedMaterial";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "GET") {
      const sortedMaterial = await SortedMaterial.findById(_id);
      res.status(200).json(sortedMaterial);
    }

    if (req.method === "PUT") {
      const { material, mass, polymer } = await req.body;
      console.log("req.body", req.body);
      const sortedMaterial = await SortedMaterial.findByIdAndUpdate(_id, {
        material,
        mass,
        polymer
      }, { runValidators: true });
      res.status(200).json({ msg: "SortedMaterial updated successfully!" });
    }

    if (req.method === "DELETE") {
      await SortedMaterial.findByIdAndDelete(_id);
      res.status(200).json({ msg: "SortedMaterial deleted successfully!" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "An error has occurred. Please try again." });
  }
}



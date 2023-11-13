import connectDB from "@/lib/mongodb";
import SortedMaterial from "@/models/sortedMaterial";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "PUT") {
      const { disposalMechanism, disposalDate } = await req.body;
      console.log("req.body", req.body);
      const sortedMaterial = await SortedMaterial.findByIdAndUpdate(_id, {
        disposalMechanism,
        disposalDate
      }, { runValidators: true });
      res.status(200).json({ msg: "SortedMaterial updated successfully!" });
    }

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "An error has occurred. Please try again." });
  }
}
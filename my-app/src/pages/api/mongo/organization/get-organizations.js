import connectDB from "@/lib/mongodb";
import Organization from "@/models/organization";

export default async function handler(req, res) {
  try {
    await connectDB();
    console.log("sending req get organizations");
    const organizations = await Organization.find({});
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch organizations." });
  }
}

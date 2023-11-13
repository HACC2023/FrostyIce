import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  try {
    const { orgId } = req.query;
    await connectDB();
    const data = await User.deleteMany({orgId: orgId});
    res.status(200).json(data);
  } catch(error) {
    res.status(500).json({ error: "Unable to delete users." });
  }
}
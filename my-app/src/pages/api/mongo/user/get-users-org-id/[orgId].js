import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const { orgId } = req.query;
      const users = await User.find({ orgId: orgId });
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Helpful error message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
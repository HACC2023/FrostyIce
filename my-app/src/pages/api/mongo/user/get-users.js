import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Helpful error message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
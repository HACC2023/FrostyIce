import connectDB from "@/lib/mongodb";
import Thread from "@/models/threads/thread";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "GET") {
      const thread = await Thread.findById(_id);
      res.status(200).json(thread);
    }

    if (req.method === "DELETE") {
      await Thread.findByIdAndDelete(_id);
      res.status(200).json({ msg: "Thread deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error has occurred. Please try again." });
  }
}



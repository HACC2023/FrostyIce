import connectDB from "@/lib/mongodb";
import Thread from "@/models/threads/thread";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      await connectDB();
      console.log("sending req get threads");
      const threads = await Thread.find({});
      res.status(200).json(threads);
    }

    if (req.method === "POST") {
      await connectDB();
      console.log("sending post request");
      const thread = await Thread.create(req.body);
      console.log("thread ok", thread.ok);
      res.status(200).json(thread);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Unable to fetch threads." });
  }
}

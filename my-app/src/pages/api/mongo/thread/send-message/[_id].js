import connectDB from "@/lib/mongodb";
import Thread from "@/models/threads/thread";

export default async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      await connectDB();
      const { _id } = req.query;
      const { messages } = await req.body;
      console.log("sending put req in threads");
      const threads = await Thread.findByIdAndUpdate(_id, { messages });
      res.status(200).json(threads);
    }
    if (req.method === "POST") {
      await connectDB();
      const { _id } = req.query;

      const { message } = req.body;

      const thread = await Thread.findById(_id);
      thread.messages.push(message);
      const updatedThread = await thread.save();

      res.status(200).json(updatedThread);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Unable to edit thread. Please try again." });
  }
}

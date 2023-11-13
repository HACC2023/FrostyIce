import connectDB from "@/lib/mongodb";
import Organization from "@/models/organization";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "GET") {
      const organization = await Organization.findById(_id);
      res.status(200).json(organization);
    }

    if (req.method === "PUT") {
      const { name, location } = await req.body;
      await Organization.findByIdAndUpdate(_id, {
        name,
        location,
        associatedNode
      }, { runValidators: true });
      res.status(200).json({ msg: "Organization updated successfully!" });
    }

    if (req.method === "DELETE") {
      await Organization.findByIdAndDelete(_id);
      res.status(200).json({ msg: "Organization deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error has occurred. Please try again." });
  }
}



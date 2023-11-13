import connectDB from "@/lib/mongodb";
import Organization from "@/models/organization";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {name, location} = await req.body;
      const associatedNode = () => {
        switch (location) {
        case "Big Island":
          return "Big Island Node";
        case "Maui":
        case "Molokai":
        case "Lanai":
          return "Maui Node";
        case "Kauai":
          return "Kauai Node";
        default:
          return "CMDR Hub";
        }
      }
      await connectDB();
      await Organization.create({
        name,
        location,
        associatedNode: associatedNode(),
      });
      res.status(200).json({msg: "Organization added successfully"});
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ error: "Organization already exists" });
      } else {
        res.status(500).json({ error: "Unable to add organization" });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

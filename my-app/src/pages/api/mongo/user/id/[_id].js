import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  try {
    await connectDB();
    const { _id } = req.query;

    if (req.method === "GET") {
      const organization = await User.findById(_id);
      res.status(200).json(organization);
    }

    if (req.method === "PUT") {
      const { firstName, lastEmail, email, role, password, orgId } = await req.body;
      await User.findByIdAndUpdate(
        _id,
        {
          firstName,
          lastEmail,
          email,
          role,
          password,
          orgId
        },
        { runValidators: true }
      );
      res.status(200).json({ msg: "User updated successfully!" });
    }

    if (req.method === "DELETE") {
      await User.findByIdAndDelete(_id);
      res.status(200).json({ msg: "User deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error has occurred. Please try again." });
  }
}

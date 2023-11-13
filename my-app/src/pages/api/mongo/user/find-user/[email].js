import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export default async function handler(req, res) {
  try {
    const { email } = req.query;
    console.log("id: ", email);
    await connectDB();
    const user = await User.findOne({ email: email.trim() });
    if (user) {
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user.image,
      });
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch item." });
  }
}

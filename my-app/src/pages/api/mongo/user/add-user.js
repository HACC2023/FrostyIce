import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { firstName, lastName, email, role, orgId } =
        await req.body;
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
      await connectDB();
      await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        orgId: orgId,
        role: role,
      });
      const emailMessage = `Aloha ${firstName},
        <br/><br/>
        Your CMDR account has been created. Account details:
        <br/>
        <ul>
          <li>Name: <b>${lastName}, ${firstName}</b></li>
          <li>Email: <b>${email}</b></li>
        </ul>
        Mahalo!<br/><br/>
        Center for Marine Debris Research
        <br/><br/>
        <hr/>
        <i>This is an automated message. Please do not reply to this email.</i>`;
      // await sendEmail('Account Created', email, emailMessage);
      res.status(200).json({ msg: "User added successfully!" });
    }
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(409).json({ error: "Email not unique" });
    } else {
      res.status(500).json({ error: "Error adding user" });
    }
  }
}

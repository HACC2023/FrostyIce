import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_DB_URI);
      console.log("DB CONNECTED");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
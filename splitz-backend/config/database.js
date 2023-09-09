import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`Database successfully connected`);
  } catch (err) {
    console.log(`Error connecting Database`, err);
    process.exit(0);
  }
};

export default connectDB;

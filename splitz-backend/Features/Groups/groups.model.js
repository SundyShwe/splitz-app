import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  members: [
    {
      user_id: mongoose.Types.ObjectId,
      fullname: String,
      email: String,
    },
  ],
  date: Number,
});

export default model("Groups", schema);

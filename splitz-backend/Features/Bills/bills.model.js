import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  title: String,
  description: String,
  icon: String,
  category: String,
  total_amount: Number,
  group_id: mongoose.Types.ObjectId,
  receipt: { filename: String, originalname: String },
  date: Number,
  remark: String,
  paid_by: [
    { user_id: mongoose.Types.ObjectId, fullname: String, paid_amount: Number },
  ],
  owed_by: [
    {
      user_id: mongoose.Types.ObjectId,
      fullname: String,
      owed_amount: Number,
      settled: Boolean,
    },
  ],
});

export default model("Bills", schema);

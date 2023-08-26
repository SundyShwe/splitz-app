import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  fromUser: { user_id: mongoose.Types.ObjectId, fullname: String },
  toUser: { user_id: mongoose.Types.ObjectId, fullname: String },
  transactions: [
    {
      bill_id: mongoose.Types.ObjectId,
      bill_title: String,
      bill_date: Number,
      group_id: mongoose.Types.ObjectId,
      group_title: String,
      amount: Number,
      settled: Boolean,
      settled_date: Number,
    },
  ],
  total_amount: Number,
});

export default model("Settlements", schema);

import { Schema, model } from "mongoose";

const schema = new Schema({
  email: { type: String, required: true },
  password: { type: String },
  fullname: { type: String, required: true },
  googleID: { type: String },
});

export default model("Users", schema);

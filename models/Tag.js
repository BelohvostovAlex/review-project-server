import { Schema, model } from "mongoose";

const TagSchema = new Schema({
  title: { type: String, required: true },
});

export default model("Tag", TagSchema);

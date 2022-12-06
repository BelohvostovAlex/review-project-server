import { Schema, model } from "mongoose";

const RatingSchema = new Schema({
  rate: { type: Number, required: true, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Rating", RatingSchema);

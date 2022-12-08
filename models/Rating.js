import { Schema, model } from "mongoose";

const RatingSchema = new Schema({
  artItem: { type: Schema.Types.ObjectId, ref: "ArtItem" },
  rate: { type: Number, required: true, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Rating", RatingSchema);

import { Schema, model } from "mongoose";

const ArtItemSchema = new Schema({
  sender: { type: String, required: true },
  review: { type: Schema.Types.ObjectId, ref: "Review" },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export default model("ArtItem", ArtItemSchema);

import { Schema, model } from "mongoose";

const ArtItemSchema = new Schema({
  title: { type: String, required: true },
  rating: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  averageRating: { type: String, required: true, default: 0 },
});

export default model("ArtItem", ArtItemSchema);

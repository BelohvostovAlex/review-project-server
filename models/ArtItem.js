import { Schema, model } from "mongoose";

const ArtItemSchema = new Schema({
  title: { type: String, required: true },
  rating: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
});

export default model("ArtItem", ArtItemSchema);

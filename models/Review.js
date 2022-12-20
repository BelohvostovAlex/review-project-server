import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  artItem: { type: Schema.Types.ObjectId, ref: "ArtItem" },
  text: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  grade: { type: Number, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model("Review", ReviewSchema);

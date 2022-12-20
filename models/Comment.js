import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  review: { type: Schema.Types.ObjectId, ref: "Review" },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export default model("Comment", CommentSchema);

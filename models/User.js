import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    lastEnter: { type: Date, default: Date.now },
    createdReviews: [
      { type: Schema.Types.ObjectId, ref: "Review", default: [] },
    ],
    likedReviews: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }],
    ratedArtItems: [
      { type: Schema.Types.ObjectId, ref: "ArtItem", default: [] },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);

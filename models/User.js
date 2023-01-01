import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: Number, default: 1 },
    status: { type: String, required: true, default: "Active" },
    lastEnter: { type: Date, default: Date.now },
    createdReviews: [
      { type: Schema.Types.ObjectId, ref: "Review", default: [] },
    ],
    likedReviews: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }],
    ratedArtItems: [
      { type: Schema.Types.ObjectId, ref: "ArtItem", default: [] },
    ],
    enteredBySocial: { type: Boolean, default: false },
    fromGoogle: { type: Boolean, default: false },
    fromTwitter: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);

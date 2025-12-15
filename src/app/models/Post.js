// src/app/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    image: { type: String, default: "" },
    tags: { type: [String], default: [] },

    // 🔥 Author reference
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);

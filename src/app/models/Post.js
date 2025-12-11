import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    author: String,
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);

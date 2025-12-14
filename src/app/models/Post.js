import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    image: {
      type: String, // Cloudinary URL
      default: "",
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model("Post", postSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // Full name, will be used in profile URL
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    location: { type: String },
    about: { type: String },
    avatar: { type: String },     
    socialLinks: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String },
      website: { type: String },
      whatsapp: { type: String }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

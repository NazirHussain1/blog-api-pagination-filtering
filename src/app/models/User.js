import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // Full name, will be used in profile URL
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    location: { type: String },
    about: { type: String },
    avatar: { type: String },
    coverImage: { type: String },
    education: {
      school: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      graduationYear: { type: Number }
    },
    work: {
      company: { type: String },
      position: { type: String },
      startYear: { type: Number },
      endYear: { type: Number },
      current: { type: Boolean, default: false }
    },
    hobbies: [{ type: String }],
    skills: [{ type: String }],
    socialLinks: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String },
      facebook: { type: String },
      website: { type: String },
      whatsapp: { type: String }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetPasswordCode: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      default: "", // e.g., "Software Engineer at Google"
    },
    about: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerPicture: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Self-referencing relationship for network
      },
    ],
    appliedJobs: [
      {
        jobId: { type: Number, required: true },
        appliedAt: { type: Date, default: Date.now },
        resumeOption: { type: String },
        coverLetter: { type: String }
      }
    ],
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        graduationYear: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);
export default User;

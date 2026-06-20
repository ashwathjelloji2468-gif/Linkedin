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
    joinedGroups: {
      type: [String],
      default: [],
    },
    followedNewsletters: {
      type: [String],
      default: [],
    },
    followedPages: {
      type: [String],
      default: [],
    },
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
    isPremium: {
      type: Boolean,
      default: false,
    },
    businessCompanies: [
      {
        name: String,
        industry: String,
        website: String,
        size: String,
        description: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    adCampaigns: [
      {
        name: String,
        objective: String,
        status: { type: String, default: "Active" },
        budget: Number,
        targetAudience: String,
        spent: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    resetPasswordCode: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);
export default User;

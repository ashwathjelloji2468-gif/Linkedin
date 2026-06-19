import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures one profile per user
    },
    headline: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    // Professional metadata
    location: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    // Array of objects for structured data
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
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
    skills: [String],
    // Social Links
    website: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;

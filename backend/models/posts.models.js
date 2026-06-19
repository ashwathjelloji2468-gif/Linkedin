import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    media: {
      type: String, // URL of the image or video
      default: null,
    },
    fileType: {
      type: String, // e.g., 'image', 'video'
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // This automatically handles createdAt and updatedAt
  },
);

const Post = mongoose.model("Post", PostSchema);
export default Post;

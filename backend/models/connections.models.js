import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate connection requests between the same two users
ConnectionSchema.index({ sender: 1, recipient: 1 }, { unique: true });

const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionSchema);
export default ConnectionRequest;

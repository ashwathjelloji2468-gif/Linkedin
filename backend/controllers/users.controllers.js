import User from "../models/users.models.js";
import Profile from "../models/profile.models.js";
import ConnectionRequest from "../models/connections.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from 'sharp';

// convert user data --> pdf:
export const convertUserDataPDF = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // 1. Create a document
    const doc = new PDFDocument();

    // 2. Set response headers to force download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${user.username}_profile.pdf"`,
    );

    // 3. Pipe the PDF into the response
    doc.pipe(res);

    // 4. Add content to the PDF
    doc.fontSize(20).text("User Profile Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Username: ${user.username}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Account Created: ${user.createdAt}`);

    // 5. Finalize the PDF
    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// 1. Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const newProfile = new Profile({
      userId: newUser._id,
    });
    await newProfile.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Logs the full stack trace
    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // Send the message to your REST client tool
    });
  }
};

// 2. Login User (Generates JWT)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Token generated here
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // req.user is populated by protectRoute middleware
    const userId = req.user.id;

    // Update User model
    await User.findByIdAndUpdate(
      userId,
      { profilePicture: req.file.filename },
      { new: true }
    );

    // Update Profile model
    await Profile.findOneAndUpdate(
      { userId },
      { profilePicture: req.file.filename },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Update Profile Fields
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, location, website, skills } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      {
        $set: { bio, location, website, skills },
      },
      { new: true, runValidators: true },
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// 5. Get user and profile:
export const getUserAndProfile = async (req, res) => {
  try {
    // req.user.id is provided by protectRoute middleware
    const userId = req.user.id;

    // Since your User schema contains all profile info, we just find the user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Fetch user error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//6.Update profile data:
export const updateProfileData = async (req, res) => {
  try {
    const userId = req.user.id;

    // DEBUG: Add this log
    console.log("Incoming request body:", req.body);

    const { name, username, email, profilePicture, headline, about, location, skills, experience, education } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePicture) updateData.profilePicture = profilePicture; 
    if (headline !== undefined) updateData.headline = headline;
    if (about !== undefined) updateData.about = about;
    if (location !== undefined) updateData.location = location;
    if (skills !== undefined) updateData.skills = skills;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: "after" },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//7. get all users:
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users and exclude the password field
    const users = await User.find().select("-password");

    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Fetch all users error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//8. download profile:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${user.username || "profile"}_resume.pdf"`,
    );

    //9. Pipe the PDF directly to the response
    doc.pipe(res);
    console.log("User object profilePicture field:", user.profilePicture);
    const imagePath = path.join(__dirname, "../uploads", user.profilePicture);
    console.log("Full calculated path:", imagePath);
    console.log("Does file exist at this path?", fs.existsSync(imagePath));
    // 1. Profile Picture Section
     if (user.profilePicture) {
  const imagePath = path.join(__dirname, "../uploads", user.profilePicture);
  
  if (fs.existsSync(imagePath)) {
    try {
      // Convert .avif to a JPEG buffer in memory
      const jpegBuffer = await sharp(imagePath).jpeg().toBuffer();
      
      // Pass the buffer to PDFKit instead of the file path
      doc.image(jpegBuffer, { fit: [100, 100], align: 'center' });
    } catch (err) {
      console.error("Sharp conversion error:", err.message);
    }
  }
}

    // 10. Personal Info Section
    doc.moveDown();
    doc.fontSize(20).text(`Name: ${user.name || "N/A"}`);
    doc.fontSize(14).text(`Username: ${user.username || "N/A"}`);
    doc.text(`Email: ${user.email || "N/A"}`);
    doc.text(`Bio: ${user.about || "N/A"}`);
    doc.moveDown();

    // 3. Experience Section
    doc.fontSize(16).text("Experience:", { underline: true });
    if (user.experience && user.experience.length > 0) {
      user.experience.forEach((exp) => {
        doc
          .fontSize(12)
          .text(`${exp.company || "N/A"} - ${exp.position || "N/A"}`);
      });
    } else {
      doc.fontSize(12).text("No experience listed.");
    }
    doc.moveDown();

    // 4. Education Section
    doc.fontSize(16).text("Education:", { underline: true });
    if (user.education && user.education.length > 0) {
      user.education.forEach((edu) => {
        doc
          .fontSize(12)
          .text(`${edu.school || "N/A"} - ${edu.fieldOfStudy || "N/A"}`);
      });
    } else {
      doc.fontSize(12).text("No education listed.");
    }

    // Finalize the PDF
    doc.end();

    // Handle stream errors
    doc.on("error", (err) => {
      console.error("PDF generation error:", err);
      if (!res.headersSent) res.status(500).send("PDF generation failed");
    });
  } catch (error) {
    console.error("Download profile controller error:", error.message);
    if (!res.headersSent)
      res.status(500).json({ message: "Internal server error" });
  }
};

//11. sendConnectionRequest:
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params; // The ID of the user receiving the request
    const senderId = req.user.id;   // The ID of the person sending the request (from JWT)

    // 1. Prevent sending a request to yourself
    if (senderId === userId) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    // 2. Check if the recipient exists
    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check if a request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: senderId, recipient: userId },
        { sender: userId, recipient: senderId }
      ],
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "A connection request is already pending" });
    }

    // 4. Check if they are already connected
    if (recipient.connections.includes(senderId)) {
      return res.status(400).json({ message: "You are already connected" });
    }

    // 5. Create the new request
    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
      status: "pending"
    });

    await newRequest.save();

    res.status(201).json({ message: "Connection request sent successfully" });

  } catch (error) {
    console.error("Error in sendConnectionRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//12. get my connection request:
export const getMyConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch requests where the current user is the recipient
    // We 'populate' the sender field to get their name and avatar
    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending"
    }).populate("sender", "name username profilePicture headline");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getMyConnectionRequests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//13. what are my connections:
export const whatAreMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the current user and populate the 'connections' array
    // This assumes your User model has a 'connections' field that is an array of ObjectIds
    const user = await User.findById(userId).populate(
      "connections", 
      "name username profilePicture headline"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.connections);
  } catch (error) {
    console.error("Error in whatAreMyConnections:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//14. accept connection request:
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // 1. Find the request and ensure it exists and belongs to the current user
    const request = await ConnectionRequest.findById(requestId).populate("sender recipient");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.recipient._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You cannot accept this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    // 2. Update request status
    request.status = "accepted";
    await request.save();

    // 3. Update both users' connections array
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId }
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id }
    });

    res.status(200).json({ message: "Connection accepted successfully" });
  } catch (error) {
    console.error("Error in acceptConnectionRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


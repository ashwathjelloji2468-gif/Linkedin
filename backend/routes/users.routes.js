import { Router } from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import multer from "multer";
// Combine them all here:
import {
  register,
  login,
  getUserAndProfile,
  uploadProfilePicture,
  uploadBannerPicture,
  updateUserProfile,
  updateProfileData,
  getAllUsers,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequests,
  whatAreMyConnections,
  acceptConnectionRequest,
  applyJob,
  getAppliedJobs
} from "../controllers/users.controllers.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post(
  "/upload-picture",
  protectRoute,
  upload.single("profilePic"),
  uploadProfilePicture,
);

router.post(
  "/upload-banner",
  protectRoute,
  upload.single("bannerPic"),
  uploadBannerPicture,
);

router.post("/register", register);
router.post("/login", login);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", protectRoute, getUserAndProfile);
router.put("/update-profile", protectRoute, updateProfileData);
router.get("/all-users", protectRoute, getAllUsers);
router.get("/user/download_resume", protectRoute, downloadProfile);
router.post("/user/send_connection_request/:userId", protectRoute, sendConnectionRequest);
router.get("/requests",protectRoute, getMyConnectionRequests);
router.get("/connections", protectRoute, whatAreMyConnections);
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.post("/jobs/apply", protectRoute, applyJob);
router.get("/jobs/applied", protectRoute, getAppliedJobs);
export default router;

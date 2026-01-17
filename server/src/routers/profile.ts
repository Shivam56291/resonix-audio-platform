import { isAuth, mustAuth } from "@/middleware/auth";
import express from "express";
import {
  updateFollower,
  getUploads,
  getPublicUploads,
  getPublicProfile,
  getPublicPlaylist,
  getRecommendByProfile,
} from "@/controllers/profile";

const router = express.Router();

router.post("/update-follower/:profileId", mustAuth, updateFollower);

router.get("/uploads", mustAuth, getUploads);

router.get("/uploads/:profileId", getPublicUploads);

router.get("/info/:profileId", getPublicProfile);

router.get("/playlist/:profileId", getPublicPlaylist);

router.get("/recommended", isAuth, getRecommendByProfile)

export default router;

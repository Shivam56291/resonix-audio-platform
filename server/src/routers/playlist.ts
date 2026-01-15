import { isVerified, mustAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import express from "express";
import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "@/utils/validationSchema";
import {
  createPlaylist,
  updatePlaylist,
  removePlaylist,
  getPlaylistByProfile,
  getAudios
} from "@/controllers/playlist";

const router = express.Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);

router.patch(
  "/",
  mustAuth,
  validate(OldPlaylistValidationSchema),
  updatePlaylist
);

router.delete("/", mustAuth, removePlaylist);

router.get("/by-profile", mustAuth, getPlaylistByProfile);

router.get("/:playlistId", mustAuth, getAudios);

export default router;

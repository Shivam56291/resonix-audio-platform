import { isVerified, mustAuth } from "@/middleware/auth";
import fileParser from "@/middleware/fileParser";
import { Router } from "express";
import { AudioValidationSchema } from "@/utils/validationSchema";
import { validate } from "@/middleware/validator";
import { createAudio, updateAudio, getLatestUploads } from "@/controllers/audio";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
);

router.patch(
  "/:audioId",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  updateAudio
); 

router.get("/latest", getLatestUploads)

export default router;

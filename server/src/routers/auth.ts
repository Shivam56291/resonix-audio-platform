import { Router } from "express";

import {
  CreateUserSchema,
  updatePasswordSchema,
} from "@/utils/validationSchema";
import { validate } from "@/middleware/validator";
import {
  create,
  verifyEmail,
  sendReVerificationToken,
  generateForgetPasswordLink,
  grantValid,
  updatePassword,
} from "@/controllers/user";
import { TokenAndIDValidation } from "@/utils/validationSchema";
import { isValidPassResetToken } from "@/middleware/auth";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);

router.post("/re-verify-email", sendReVerificationToken);

router.post("/forget-password", generateForgetPasswordLink);

router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);

router.post(
  "/update-password",
  validate(updatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);

export default router;

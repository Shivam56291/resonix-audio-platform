import { Router } from "express";

import {
  CreateUserSchema,
  SignInValidationSchema,
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
  singIn,
  updateProfile,
  sendProfile,
  logOut,
} from "@/controllers/auth";
import { TokenAndIDValidation } from "@/utils/validationSchema";
import { isValidPassResetToken, mustAuth } from "@/middleware/auth";
import fileParser, { RequestWithFiles } from "@/middleware/fileParser";

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

router.post("/sign-in", validate(SignInValidationSchema), singIn);

router.get("/is-auth", mustAuth, sendProfile);

router.post("/update-profile", mustAuth, fileParser, updateProfile);

router.post("/log-out", mustAuth, logOut);

export default router;

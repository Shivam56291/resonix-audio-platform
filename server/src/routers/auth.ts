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
} from "@/controllers/user";
import { TokenAndIDValidation } from "@/utils/validationSchema";
import { isValidPassResetToken, mustAuth } from "@/middleware/auth";
import user from "@/models/user";

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

router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});

router.get("/public", (req, res) => {
  res.json({
    message: "You are in public route."
  });
});

router.get("/private", mustAuth, (req, res) => {
  res.json({
    message: "You are in private route.",
  });
});

export default router;

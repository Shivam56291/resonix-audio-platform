import { Router } from "express";

import { CreateUserSchema } from "@/utils/validationSchema";
import { validate } from "@/middleware/validator";
import { create, verifyEmail, sendReVerificationToken, generateForgetPasswordLink } from "@/controllers/user";
import { EmailVerificationBody } from "@/utils/validationSchema";


const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);

router.post("/re-verify-email", sendReVerificationToken);

router.post('/forget-password', generateForgetPasswordLink);

export default router;

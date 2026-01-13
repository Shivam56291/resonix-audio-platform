import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import Jwt from "jsonwebtoken";

import { CreateUser } from "@/@types/user";
import User from "@/models/user";
import {
  sendVerificationMail,
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
} from "@/utils/mail";
import { generateToken } from "@/utils/helper";
import EmailVerificationToken from "@/models/emailVerficationToken";
import { VerifyEmailRequest } from "@/@types/user";
import PasswordResetToken from "@/models/passwordResetToken";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "@/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const newUser = await User.create({ email, password, name });

  const token = generateToken(6);

  await EmailVerificationToken.create({ owner: newUser._id, token });

  sendVerificationMail(token, {
    name,
    email,
    userId: newUser._id.toString(),
  });

  res.status(201).json({ user: newUser._id, name, email });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  // 1. Check user first
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2. If already verified → better UX
  if (user.verified) {
    return res
      .status(200)
      .json({ message: "Your email is already verified. You can log in." });
  }

  // 3. Find verification token
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken) {
    return res.status(403).json({ message: "Verification token not found" });
  }

  // 4. Compare token
  const matched = await verificationToken.compareToken(token);
  if (!matched) {
    return res.status(403).json({ message: "Invalid verification token" });
  }

  // 5. Verify user
  user.verified = true;
  await user.save();

  // 6. Delete token
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  return res.status(200).json({ message: "Email verified successfully" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(403).json({ message: "Invalid Request" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(403).json({ message: "Invalid Request" });
  }

  if (user.verified) {
    return res
      .status(200)
      .json({ message: "Your email is already verified. You can log in." });
  }

  await EmailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken(6);
  await EmailVerificationToken.create({ owner: userId, token });

  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.status(201).json({ message: "Verification token sent successfully" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Account not found" });
  }

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({ owner: user._id, token });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email, link: resetLink });

  res.status(201).json({ message: "Reset password link sent successfully" });
};

export const grantValid: RequestHandler = (req, res) => {
  res.status(200).json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(403).json({ message: "Unauthorized Access" });
  }

  const matched = await user.comparePassword(password);
  if (matched) {
    return res.status(422).json({
      message: "New password must be different from the old password",
    });
  }

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPassResetSuccessEmail(user.name, user.email);

  res.status(200).json({ message: "Password updated successfully" });
};

export const singIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  const matched = await user.comparePassword(password);
  if (!matched) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  const token = Jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

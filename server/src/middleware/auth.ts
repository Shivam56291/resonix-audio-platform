import { RequestHandler } from "express";

import User from "@/models/user";
import passwordResetToken from "@/models/passwordResetToken";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "Account not found" });
  }

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const matched = await resetToken.compareToken(token);
  if (!matched) {
    return res.status(403).json({ message: "Invalid reset token" });
  }

  next();
};

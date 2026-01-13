import { RequestHandler } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/variables";

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

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({
      message: "Unauthorized Request",
    });
  }

  const payload = Jwt.verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) {
    return res.status(403).json({
      message: "Unauthorized Request",
    });
  }

  req.user = {
    id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };
  req.token = token;

  next();
};

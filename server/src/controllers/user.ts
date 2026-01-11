import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import path from "path";

import { CreateUser } from "@/@types/user";
import User from "@/models/user";
import { MAILTRAP_USER, MAILTRAP_PASS } from "@/utils/variables";
import { generateToken } from "@/utils/helper";
import EmailVerificationToken from "@/models/emailVerficationToken";
import { generateTemplate } from "@/mail/template";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const newUser = await User.create({ email, password, name });

  // send email
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  const token = generateToken(6);
  await EmailVerificationToken.create({ owner: newUser._id, token });

  const welcomeMessage = `Hello ${name}, welcome to Resonix! There are so much thing that we do for verified users. Use the given OTP to verify your email address.`;

  transport.sendMail({
    from: "Resonix Audio Platform <no-reply@resonixaudio.com>",
    to: email,
    html: generateTemplate({
      title: "Welcome to Resonix Audio Platform",
      message: welcomeMessage,
      link: `#`,
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../public/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../public/welcome.png"),
        cid: "welcome",
      },
    ],
  });

  res.status(201).json({ newUser });
};

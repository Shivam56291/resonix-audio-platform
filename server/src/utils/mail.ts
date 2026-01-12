import nodemailer from "nodemailer";

import { MAILTRAP_USER, MAILTRAP_PASS } from "@/utils/variables"
import EmailVerificationToken from "@/models/emailVerficationToken";
import path from "path";
import { generateTemplate } from "@/mail/template";
import { VERIFICATION_EMAIL } from "@/utils/variables";

export const generateMailTransporter = () => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  return transport;
}

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();
  const { name, email, userId } = profile;

  const welcomeMessage = `Hello ${name}, welcome to Resonix! There are so much thing that we do for verified users. Use the given OTP to verify your email address.`;

  transport.sendMail({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Welcome to Resonix",
    html: generateTemplate({
      title: "Welcome to Resonix",
      message: welcomeMessage,
      link: `#`,
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
}

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();
  const { email, link } = options;

  const message = `We just received a request to reset your password. If you made this request, please click on the link below to reset your password.`;

  transport.sendMail({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Reset Password Link",
    html: generateTemplate({
      title: "Reset Password",
      message,
      link,
      logo: "cid:logo",
      banner: "cid:forget_password",
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
}
import { UserDocument } from "@/models/user";

export const generateToken = (length: number) => {
  const characters = "0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

export const formatProfile = (profile: UserDocument) => {
  return {
    id: profile._id,
    name: profile.name,
    email: profile.email,
    verified: profile.verified,
    avatar: profile.avatar?.url,
    followers: profile.followers.length,
    followings: profile.followings.length,
  };
};

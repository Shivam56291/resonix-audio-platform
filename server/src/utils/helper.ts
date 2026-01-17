import History from "@/models/history";
import { UserDocument } from "@/models/user";
import { Request } from "express";
import moment from "moment";

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

export const getUsersPreviousHistory = async (req: Request): Promise<string[]> => {
  const [result] = await History.aggregate([
    { $match: { owner: req.user.id } },
    { $unwind: "$all" },
    {
      $match: {
        "all.date": {
          // only those histories which are not older than 30 days
          $gte: moment().subtract(30, "days").toDate(),
        },
      },
    },
    { $group: { _id: "$all.audio" } },
    {
      $lookup: {
        from: "audios",
        localField: "_id",
        foreignField: "_id",
        as: "audioData",
      },
    },
    { $unwind: "$audioData" },
    { $group: { _id: null, category: { $addToSet: "$audioData.category" } } },
  ]);

  if(result){
    return result.category
  }

  return []
};

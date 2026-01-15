import { RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import User from "@/models/user";
import { paginationQuery } from "@/@types/misc";
import Audio, { AudioDocument } from "@/models/audio";
import Playlist from "@/models/playlist";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ message: "Invalid profile ID" });

  if (profileId === userId)
    return res.status(400).json({ message: "You cannot follow yourself" });

  const profile = await User.findById(profileId);
  if (!profile) return res.status(404).json({ message: "Profile not found" });

  const alreadyFollower = profile.followers.includes(userId);
  const status: "added" | "removed" = alreadyFollower ? "removed" : "added";

  if (alreadyFollower) {
    await User.updateOne({ _id: profileId }, { $pull: { followers: userId } });
    await User.updateOne({ _id: userId }, { $pull: { followings: profileId } });
  } else {
    await User.updateOne(
      { _id: profileId },
      { $addToSet: { followers: userId } }
    );
    await User.updateOne(
      { _id: userId },
      { $addToSet: { followings: profileId } }
    );
  }

  return res.json({ message: "Follower updated successfully", status });
};

export const getUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: req.user.name, id: req.user.id },
    };
  });

  res.status(201).json({ audios });
};

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ message: "Invalid profile ID" });

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .populate<AudioDocument<{ name: string; _id: mongoose.Types.ObjectId }>>(
      "owner"
    );

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.status(201).json({ audios });
};

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile ID" });

  const profile = await User.findById(profileId);

  if (!profile) return res.status(404).json({ error: "Profile not found" });

  res.status(200).json({
    profile: {
      id: profile._id,
      name: profile.name,
      followers: profile.followers.length,
      avatar: profile.avatar?.url,
    },
  });
};

export const getPublicPlaylist: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile ID" });

  const data = await Playlist.find({ owner: profileId, visibility: "public" })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  if (!data) return res.status(404).json({ error: "Playlists not found" });

  const playlists = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.status(201).json({ playlists });
};

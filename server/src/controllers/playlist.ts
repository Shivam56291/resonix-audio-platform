import {
  CreatePlaylistRequest,
  PopulateFavList,
  UpdatePlaylistRequest,
} from "@/@types/audio";
import { RequestHandler } from "express";
import Audio from "@/models/audio";
import Playlist from "@/models/playlist";
import mongoose, { isValidObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res
) => {
  const { title, resId, visibility } = req.body;
  const ownerId = req.user.id;

  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio) {
      return res.status(404).json({ error: "Could not find the audio!" });
    }
  }

  const newId = new mongoose.Types.ObjectId(resId);

  const newPlaylist = new Playlist({
    title,
    owner: ownerId,
    items: resId ? [newId] : [],
    visibility,
  });

  await newPlaylist.save();

  res.status(201).json({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: UpdatePlaylistRequest,
  res
) => {
  const { title, item, id, visibility } = req.body;

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    { title, visibility },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json({ error: "Could not find the playlist!" });
  }

  if (item) {
    const audio = await Audio.findById(item);

    if (!audio) {
      return res.status(404).json({ error: "Could not find the audio!" });
    }

    await Playlist.findByIdAndUpdate(id, { $addToSet: { items: audio._id } });
  }

  res.status(201).json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (req, res) => {
  const { playlistId, resId, all } = req.query;

  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ error: "Invalid playlist ID!" });
  }

  if (all === "yes") {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({ error: "Could not find the playlist!" });
    }
  }

  if (resId) {
    if (!isValidObjectId(resId)) {
      return res.status(422).json({ error: "Invalid audio ID!" });
    }
    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: req.user.id },
      { $pull: { items: resId } }
    );

    if (!playlist) {
      return res.status(404).json({ error: "Could not find the playlist!" });
    }
  }

  res.status(201).json({ success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const playlists = await Playlist.find({
    owner: req.user.id,
    visibility: { $ne: "auto" },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const playlist = playlists.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.status(201).json({ playlist });
};

export const getAudios: RequestHandler = async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ error: "Invalid playlist ID!" });
  }

  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user.id,
  }).populate<{ items: PopulateFavList[] }>({
    path: "items",
    populate: { path: "owner", select: "name" },
  });

  if (!playlist) {
    return res.status(404).json({ error: "Could not find the playlist!" });
  }

  const audios = playlist.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.status(201).json({
    list: {
      id: playlist._id,
      title: playlist.title,
      items: audios,
    },
  });
};

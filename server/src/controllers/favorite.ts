import Audio, { AudioDocument } from "@/models/audio";
import Favorite from "@/models/favorite";
import { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import { PopulateFavList } from "@/@types/audio";

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "added" | "removed";

  if (!isValidObjectId(audioId)) {
    return res.status(422).json({ error: "Invalid audio id" });
  }

  const audio = await Audio.findById(audioId);
  if (!audio) {
    return res.status(404).json({ error: "Resources not found" });
  }

  const audioObjectId = new Types.ObjectId(audioId);

  const alreadyExists = await Favorite.findOne({
    owner: req.user.id,
    items: audioObjectId,
  });

  if (alreadyExists) {
    await Favorite.updateOne(
      { owner: req.user.id },
      { $pull: { items: audioObjectId } }
    );

    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    if (favorite) {
      await Favorite.updateOne(
        { owner: req.user.id },
        { $addToSet: { items: audioObjectId } }
      );
    } else {
      await Favorite.create({ owner: req.user.id, items: [audioObjectId] });
    }

    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id },
    });
  }

  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, { $pull: { likes: req.user.id } });
  }

  res.json({ status });
};

export const getFavorites: RequestHandler = async (req, res) => {
  const favorite = await Favorite.findOne({ owner: req.user.id }).populate<{
    items: PopulateFavList[];
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  });
  if (!favorite) {
    return res.status(404).json({ audio: [] });
  }

  const audios = favorite.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({ audios });
};

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;

  if (!isValidObjectId(audioId)) {
    return res.status(422).json({ error: "Invalid audio id" });
  }

  const audio = await Audio.findById(audioId);
  if (!audio) {
    return res.status(404).json({ error: "Resources not found" });
  }

  const audioObjectId = new Types.ObjectId(audioId);

  const favorite = await Favorite.findOne({
    owner: req.user.id,
    items: audioObjectId,
  });

  res.json({ result: favorite ? true : false });
};
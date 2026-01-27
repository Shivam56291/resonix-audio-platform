import Audio, { AudioDocument } from "@/models/audio";
import Favorite from "@/models/favorite";
import { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import { PopulateFavList } from "@/@types/audio";
import { paginationQuery } from "@/@types/misc";
import User from "@/models/user";

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
      { $pull: { items: audioObjectId } },
    );

    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    if (favorite) {
      await Favorite.updateOne(
        { owner: req.user.id },
        { $addToSet: { items: audioObjectId } },
      );
    } else {
      await Favorite.create({ owner: req.user.id, items: [audioObjectId] });
    }

    status = "added";
  }

  if (status === "added") {
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { favorites: audioObjectId } },
    );

    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id },
    });
  }

  if (status === "removed") {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { favorites: audioObjectId } },
    );

    await Audio.findByIdAndUpdate(audioId, { $pull: { likes: req.user.id } });
  }

  res.json({ status });
};

export const getFavorites: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  const favorites = await Favorite.aggregate([
    { $match: { owner: new Types.ObjectId(req.user.id) } },
    {
      $project: {
        audioIds: {
          $slice: [
            "$items",
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
          ],
        },
      },
    },
    {
      $unwind: "$audioIds",
    },
    {
      $lookup: {
        from: "audios",
        localField: "audioIds",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    {
      $unwind: "$audioInfo",
    },
    {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $unwind: "$ownerInfo",
    },
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        category: "$audioInfo.category",
        file: "$audioInfo.file.url",
        poster: { $ifNull: ["$audioInfo.poster.url", null] },
        owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
      },
    },
  ]);

  return res.json({ audios: favorites });
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

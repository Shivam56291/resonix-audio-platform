import { RequestHandler } from "express";

import History, { historyType } from "@/models/history";
import { paginationQuery } from "@/@types/misc";
import { Types } from "mongoose";

export const updateHistory: RequestHandler = async (req, res) => {
  try {
    const { audio, progress, date } = req.body;
    const owner = req.user.id;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const history = { audio, progress, date };

    // Try updating same audio on same day
    const updated = await History.updateOne(
      {
        owner,
        "all.audio": audio,
        "all.date": { $gte: startOfDay, $lt: endOfDay },
      },
      {
        $set: {
          "all.$.progress": progress,
          "all.$.date": date,
          last: history,
        },
      }
    );

    // If no document matched → insert new
    if (updated.matchedCount === 0) {
      await History.updateOne(
        { owner },
        {
          $push: { all: { $each: [history], $position: 0 } },
          $set: { last: history },
        },
        { upsert: true }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update history" });
  }
};

export const removeHistory: RequestHandler = async (req, res) => {
  try {
    const removeAll = req.query.all === "yes";

    // 🔹 Remove all history
    if (removeAll) {
      await History.findOneAndDelete({ owner: req.user.id });
      return res.json({ success: true });
    }

    // 🔹 Remove selected history items
    if (!req.query.histories) {
      return res.status(400).json({ error: "histories is required" });
    }

    const ids = JSON.parse(req.query.histories as string);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid histories list" });
    }

    await History.findOneAndUpdate(
      { owner: req.user.id },
      { $pull: { all: { _id: { $in: ids } } } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Failed to remove history" });
  }
};

export const getHistories: RequestHandler = async (req, res) => {
  try {
    const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

    const owner = new Types.ObjectId(req.user.id);
    const page = Number(pageNo);
    const size = Number(limit);

    const histories = await History.aggregate([
      {
        $match: { owner },
      },
      {
        $project: {
          _id: 1,
          last: 1,
          all: {
            $slice: ["$all", page * size, size],
          },
        },
      },
      { $unwind: "$all" },
      {
        $lookup: {
          from: "audios",
          localField: "all.audio",
          foreignField: "_id",
          as: "audioInfo",
        },
      },
      {
        $unwind: "$audioInfo",
      },
      {
        $project: {
          _id: 1,
          id: "$all._id",
          audioId: "$audioInfo._id",
          date: "$all.date",
          title: "$audioInfo.title",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          audios: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          audios: "$$ROOT.audios",
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    res.json({ histories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get history" });
  }
};

export const getRecentlyPlayed: RequestHandler = async (req, res) => {
  try {
    const owner = new Types.ObjectId(req.user.id);

    const sliceMatch = {
      $project: {
        _id: 0,
        myHistory: {
          $slice: ["$all", 10],
        },
      },
    };
    const dateSort = {
      $project: {
        histories: {
          $sortArray: {
            input: "$myHistory",
            sortBy: { date: -1 },
          },
        },
      },
    };
    const unwindWithIndex = {
      $unwind: { path: "$histories", includeArrayIndex: "index" },
    };
    const lookupAudio = {
      $lookup: {
        from: "audios",
        localField: "histories.audio",
        foreignField: "_id",
        as: "audioInfo",
      },
    };
    const unwindAudioInfo = {
      $unwind: "$audioInfo",
    };
    const userLookup = {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "owner",
      },
    };
    const unwindUser = {
      $unwind: "$owner",
    };
    const projectResult = {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        category: "$audioInfo.category",
        owner: { name: "$owner.name", id: "$owner._id" },
        date: "$histories.date",
        progress: "$histories.progress",
      },
    };

    const recentlyPlayed = await History.aggregate([
      {
        $match: { owner },
      },
      sliceMatch,
      dateSort,
      unwindWithIndex,
      lookupAudio,
      unwindAudioInfo,
      userLookup,
      unwindUser,
      projectResult,
    ]);

    res.json({ recentlyPlayed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get recently played" });
  }
};

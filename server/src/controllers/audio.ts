import { RequestWithFiles } from "@/middleware/fileParser";
import { categoriesTypes } from "@/utils/audio_category";
import { RequestHandler } from "express";
import formidable from "formidable";
import cloudinary from "@/cloud";
import Audio from "@/models/audio";

interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}

export const createAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const audioFile = req.files?.file as formidable.File;
  const ownerId = req.user.id;

  if (!audioFile) {
    return res.status(422).json({ error: "Audio file is missing!" });
  }

  const audioRes = await cloudinary.uploader.upload(audioFile.filepath, {
    resource_type: "video",
  });

  if (!audioRes) {
    return res.status(500).json({ error: "Failed to upload audio file!" });
  }

  const newAudio = await new Audio({
    title,
    about,
    owner: ownerId,
    file: {
      url: audioRes.secure_url,
      publicId: audioRes.public_id,
    },
    category,
  });

  if (poster) {
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });

    if (!posterRes) {
      return res.status(500).json({ error: "Failed to upload poster file!" });
    }

    newAudio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await newAudio.save();

  return res.status(201).json({
    audio: {
      title: newAudio.title,
      about: newAudio.about,
      file: newAudio.file,
      poster: newAudio.poster,
    },
  });
};

export const updateAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const ownerId = req.user.id;
  const audioId = req.params.id;

  const audio = await Audio.findOneAndUpdate(
    { _id: audioId, owner: ownerId },
    { title, about, category },
    { new: true }
  );
  if (!audio) {
    return res.status(404).json({ error: "Record not found!" });
  }

  if (poster) {
    if (audio.poster?.publicId) {
      await cloudinary.uploader.destroy(audio.poster.publicId);
    }

    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });

    if (!posterRes) {
      return res.status(500).json({ error: "Failed to upload poster file!" });
    }

    audio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };

    await audio.save();
  }

  return res.status(201).json({
    audio: {
      title: audio.title,
      about: audio.about,
      file: audio.file,
      poster: audio.poster,
    },
  });
};

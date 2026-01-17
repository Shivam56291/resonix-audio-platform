import { categories, categoriesTypes } from "@/utils/audio_category";
import { Model, model, models, Schema, Types } from "mongoose";

export interface AudioDocument<T = Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  about: string;
  owner: T;
  file: {
    url: string;
    publicId: string;
  };
  poster?: {
    url: string;
    publicId: string;
  };
  likes: Types.ObjectId[];
  category: categoriesTypes;
  createdAt: Date;
}

const AudioSchema = new Schema<AudioDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 100,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    file: {
      type: Object,
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    poster: {
      type: Object,
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      likes: [
        {
          type: Types.ObjectId,
          ref: "User",
        },
      ],
    },
    category: {
      type: String,
      enum: categories,
      default: "Others",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Audio = models.Audio || model("Audio", AudioSchema);

export default Audio as Model<AudioDocument>;
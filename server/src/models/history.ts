import mongoose, { Model, model, models, Schema } from "mongoose";

export type historyType = {
  audio: mongoose.Types.ObjectId;
  progress: number;
  date: Date;
};

interface HistoryDocument extends mongoose.Document {
  owner: mongoose.Types.ObjectId;
  last: historyType;
  all: historyType[];
}

const historySchema = new Schema<HistoryDocument>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    last: {
      audio: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Audio",
      },
      progress: Number,
      date: { type: Date, required: true },
    },
    all: [
      {
        audio: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Audio",
        },
        progress: Number,
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

const History = models.History || model("History", historySchema);

export default History as Model<HistoryDocument>;

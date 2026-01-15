import mongoose, { models, Types } from "mongoose";

interface PlaylistDocument {
  title: string;
  owner: Types.ObjectId;
  items: Types.ObjectId[];
  visibility: "public" | "private" | "auto";
}

const playlistSchema = new mongoose.Schema<PlaylistDocument>({
  title: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  items: [{ type: Types.ObjectId, ref: "Audio", required: true }],
  visibility: {
    type: String,
    enum: ["public", "private", "auto"],
    default: "public",
  },
}, {
  timestamps: true,
});

const Playlist = models.Playlist || mongoose.model("Playlist", playlistSchema);

export default Playlist as mongoose.Model<PlaylistDocument>;
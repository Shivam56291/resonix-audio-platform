import { Types, Schema, models, model, Model } from "mongoose";

interface FavoriteDocument {
  owner: Types.ObjectId;
  items: Types.ObjectId[];
}

const FavoriteSchema = new Schema<FavoriteDocument>(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [Types.ObjectId],
      ref: "Audio",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Favorite =
  models.Favorite || model("Favorite", FavoriteSchema);

export default Favorite as Model<FavoriteDocument>;

import mongoose from "mongoose";
import { MONGODB_URI } from "@/utils/variables";


mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

import express from "express";
import "dotenv/config";

import "./db";
import { PORT } from "@/utils/variables";
import authRouter from "@/routers/auth";
import audioRouter from "@/routers/audio";
import favoriteRouter from "@/routers/favorite";
import playlistRouter from "@/routers/playlist";
import profileRouter from "@/routers/profile";
import historyRouter from "@/routers/history";
import "@/utils/schedule";
import { errorHandler } from "@/middleware/errors";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", express.json(), authRouter);
app.use("/favorite", express.json(), favoriteRouter);
app.use("/playlist", express.json(), playlistRouter);
app.use("/profile", express.json(), profileRouter);
app.use("/history", express.json(), historyRouter);

// multipart routes (Formidable)
app.use("/audio", audioRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

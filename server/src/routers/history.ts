import express from "express";

import { mustAuth } from "@/middleware/auth";
import {
  updateHistory,
  removeHistory,
  getHistories,
  getRecentlyPlayed,
} from "@/controllers/history";
import { UpdateHistorySchema } from "@/utils/validationSchema";
import { validate } from "@/middleware/validator";

const router = express.Router();

router.post("/", mustAuth, validate(UpdateHistorySchema), updateHistory);

router.delete("/", mustAuth, removeHistory);

router.get("/", mustAuth, getHistories);

router.get("/recently-played", mustAuth, getRecentlyPlayed);

export default router;

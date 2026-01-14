import { Router } from "express";
import { isVerified, mustAuth } from "@/middleware/auth";
import { toggleFavorite, getFavorites, getIsFavorite } from "@/controllers/favorite"

const router = Router();

router.post("/", mustAuth, isVerified, toggleFavorite);

router.get("/", mustAuth, getFavorites);

router.get("/is-fav", mustAuth, getIsFavorite )

export default router;
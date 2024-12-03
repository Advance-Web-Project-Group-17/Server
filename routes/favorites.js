import express from "express";
import {
  addFavorite,
  getUserFavoriteList,
  getSharedFavoriteList,
  toggleFavoriteSharingController,
  removeFavorite,
} from "../controllers/FavoritesController.js";

const favoritesRouter = express.Router();

// Add a favorite
favoritesRouter.post("/add", addFavorite);

// Get all favorites for a user
favoritesRouter.get("/:user_id", getUserFavoriteList);

// Get shared favorites by username
favoritesRouter.get("/shared/:username", getSharedFavoriteList);

// Toggle sharing for a user's favorites
favoritesRouter.put("/:user_id/toggle-sharing", toggleFavoriteSharingController);

// Remove a favorite
favoritesRouter.delete("/:user_id/:movie_id", removeFavorite);

export { favoritesRouter };
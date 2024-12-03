import {
  insertFavorite,
  getUserFavorites,
  getSharedFavorites,
  toggleFavoriteSharing,
  deleteFavorite,
  isFavoriteExists,
} from "../models/favoritesModel.js";
import axios from "axios";
import { ApiError } from "../helpers/ApiError.js";

// Add a favorite
const addFavorite = async (req, res, next) => {
  try {
    const { user_id, movie_id, type } = req.body;

    // Validate input
    if (!user_id || !movie_id || !type) {
      return res
        .status(400)
        .json({
          message: "All fields are required: user_id, movie_id, type.",
        });
    }

    // Check if the favorite already exists
    const favoriteExists = await isFavoriteExists(user_id, movie_id);
    if (favoriteExists.rowCount > 0) {
      return res
        .status(400)
        .json({ message: "This item is already in your favorites list!" });
    }

    // Add favorite
    const result = await insertFavorite(user_id, movie_id, type);
    res.status(201).json({
      message: "Favorite added successfully!",
      favorite: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    next(error);
  }
};

// Get all favorites for a user
const getUserFavoriteList = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    // Validate input
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch user favorites from the database
    const userFavorites = await getUserFavorites(user_id);

    if (!userFavorites.rows || userFavorites.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No favorites found for the user." });
    }

    // Extract unique movie or TV show IDs grouped by type
    const groupedFavorites = userFavorites.rows.reduce(
      (acc, item) => {
        acc[item.type] = acc[item.type] || [];
        acc[item.type].push(item.movie_id);
        return acc;
      },
      { movie: [], tv: [] }
    );

    // Helper function to fetch details from TMDB
    const fetchDetails = async (ids, type) => {
      return Promise.all(
        ids.map(async (id) => {
          try {
            const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.API_KEY}`;
            const response = await axios.get(url);
            return response.data;
          } catch (err) {
            if (err.response && err.response.status === 404) {
              console.warn(`${type} with ID ${id} not found.`);
              return null; // Skip if not found
            }
            throw err; // Re-throw for unexpected errors
          }
        })
      );
    };

    // Fetch movies and TV shows in parallel
    const [movies, tvShows] = await Promise.all([
      fetchDetails(groupedFavorites.movie, "movie"),
      fetchDetails(groupedFavorites.tv, "tv"),
    ]);

    // Combine results and filter out null entries
    const result = {
      movies: movies.filter((item) => item !== null),
      tvShows: tvShows.filter((item) => item !== null),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    next(error);
  }
};

// Get shared favorites for a username
const getSharedFavoriteList = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    const result = await getSharedFavorites(username);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No shared favorites found for this user." });
    }

    res.status(200).json({ favorites: result.rows });
  } catch (error) {
    console.error("Error fetching shared favorites:", error);
    next(error);
  }
};

// Toggle sharing for a user's favorites
const toggleFavoriteSharingController = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { is_shared } = req.body;

    // Validate input
    if (!user_id || typeof is_shared !== "boolean") {
      return res
        .status(400)
        .json({ message: "User ID and is_shared status are required." });
    }

    const result = await toggleFavoriteSharing(user_id, is_shared);
    res.status(200).json({
      message: `Favorites sharing ${
        is_shared ? "enabled" : "disabled"
      } successfully.`,
      updatedFavorites: result.rows,
    });
  } catch (error) {
    console.error("Error toggling favorite sharing:", error);
    next(error);
  }
};

// Remove a favorite
const removeFavorite = async (req, res, next) => {
  try {
    const { user_id, movie_id } = req.params;

    // Validate input
    if (!user_id || !movie_id) {
      return res
        .status(400)
        .json({ message: "User ID and Movie ID are required." });
    }

    const result = await deleteFavorite(user_id, movie_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    res.status(200).json({ message: "Favorite removed successfully!" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    next(error);
  }
};

export {
  addFavorite,
  getUserFavoriteList,
  getSharedFavoriteList,
  toggleFavoriteSharingController,
  removeFavorite,
};

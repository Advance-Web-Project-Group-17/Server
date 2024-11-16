/**
 * reviewRouter.js
 * 
 * Defines routes for movie reviews functionality.
 * 
 * Routes:
 * - POST /reviews: Adds a new review for a movie.
 * - GET /movies/:movieId/reviews: Retrieves all reviews for a specific movie.
 * 
 * Imports:
 * - express: Web framework for routing.
 * - postReview, getReviews: Controller functions for review actions.
 */

import express from "express";
import { postReview, getReviews } from "../controllers/ReviewController.js";

const reviewRouter = express.Router();

/**
 * Route to post a new review
 * @route POST /reviews
 * @access Public (or Private if authMiddleware is enabled)
 * @description Adds a new review for a movie.
 */
reviewRouter.post("/reviews", postReview);

/**
 * Route to get reviews for a specific movie
 * @route GET /movies/:movieId/reviews
 * @access Public
 * @description Retrieves all reviews for the specified movie by its ID.
 */
reviewRouter.get("/movies/:movieId/reviews", getReviews);

export { reviewRouter }

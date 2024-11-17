/**
 * reviewRouter.js
 * 
 * Defines routes for movie reviews functionality.
 * 
 * Routes:
 * - POST /reviews: Adds a new review for a movie. Requires authentication.
 * - GET /movies/:movieId/reviews: Retrieves all reviews for a specific movie. Publicly accessible.
 * 
 * Imports:
 * - express: Web framework for routing.
 * - postReview, getReviews: Controller functions for review actions.
 * - authenticateToken: Middleware to validate JWT for authenticated routes.
 */

import express from "express";
import { postReview, getReviews } from "../controllers/ReviewController.js";
import { authenticateToken } from "../helpers/authMiddleware.js";

const reviewRouter = express.Router();

/**
 * POST /reviews
 * @description Adds a new review for a movie. Requires user authentication.
 * @access Private
 */
reviewRouter.post("/reviews", authenticateToken, postReview);

/**
 * GET /movies/:movieId/reviews
 * @description Retrieves all reviews for a specific movie. Publicly accessible.
 * @access Public
 */
reviewRouter.get("/movies/:movieId/reviews", getReviews);

export { reviewRouter };

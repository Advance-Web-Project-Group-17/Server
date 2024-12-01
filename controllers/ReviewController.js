/**
 * reviewController.js
 * 
 * Controller functions for managing movie reviews.
 * 
 * Functions:
 * - postReview: Handles adding a new review to the database. Authenticated users only.
 * - getReviews: Retrieves all reviews for a specific movie. Publicly accessible.
 * 
 * Imports:
 * - ApiError: Custom error handling class for creating API errors.
 * - insertReview, fetchReviewsByMovie: Database functions from reviewModel for interacting with the reviews table.
 * - authenticateToken: Middleware to validate JWT and extract user information for authenticated routes.
 */

import { ApiError } from "../helpers/ApiError.js"; // Custom error handling class
import { insertReview, fetchReviewsByMovie } from "../models/ReviewModel.js"; // Database functions
import { getUser } from "../models/User.js";

/**
 * postReview - Controller function to add a review.
 * 
 * Requires:
 * - Authenticated user (via JWT).
 * - Valid review data in request body: { movie_id, review_text, rating }.
 * 
 * @param {Object} req - Express request object containing review data in req.body and authenticated user in req.user.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for error handling.
 */
export const postReview = async (req, res, next) => {
  try {
    // Extract user information from the token (added by auth middleware)
    const user_info = await getUser(req.user); // Fetch user details by user_name
        if (user_info.rows.length === 0) {
            throw new Error(`User with username '${user_name}' not found.`);
        }
    const user_id = user_info.rows[0].user_id
    console.log("user_id: ", user_id)

    // Extract review details from the request body
    const { movie_id, review_text, rating } = req.body;

    // Validate required fields
    if (!movie_id || !review_text || rating == null) {
      throw new ApiError("All fields are required", 400);
    }

    // Insert the review into the database
    const result = await insertReview(user_id, movie_id, review_text, rating);

    res.status(201).json({ message: "Review added successfully", review: result.rows[0] });
  } catch (error) {
    console.error("Error in postReview:", error);
    next(new ApiError("Error adding review", 500, error));
  }
};

/**
 * getReviews - Controller function to retrieve reviews for a specific movie.
 * 
 * Publicly accessible route.
 * 
 * @param {Object} req - Express request object containing movieId in req.params.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for error handling.
 */
export const getReviews = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const result = await fetchReviewsByMovie(movieId);
    const reviews = result.rows;

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error in getReviews:", error);
    next(new ApiError("Error retrieving reviews", 500, error));
  }
};

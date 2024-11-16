/**
 * reviewController.js
 * 
 * Controller functions for managing movie reviews.
 * 
 * Functions:
 * - postReview: Handles adding a new review to the database.
 * - getReviews: Retrieves all reviews for a specific movie.
 * 
 * Imports:
 * - ApiError: Custom error handling class for creating API errors.
 * - insertReview, fetchReviewsByMovie: Database functions from reviewModel for interacting with the reviews table.
 */

import { ApiError } from "../helpers/ApiError.js";  // Importing custom error handling class
import { insertReview, fetchReviewsByMovie } from "../models/ReviewModel.js"; // Importing model functions

/**
 * postReview - Controller function to add a review.
 * 
 * @param {Object} req - Express request object containing review data in req.body
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function for error handling
 */
export const postReview = async (req, res, next) => {
    try {
        const { user_id, movie_id, review_text, rating } = req.body;

        if (!user_id || !movie_id || !review_text || rating == null) {
        throw new ApiError("All fields are required", 400);
        }

        const result = await insertReview(user_id, movie_id, review_text, rating);
        const newReview = result.rows[0];

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error(error);
        next(new ApiError("Error adding review", 500, error));
    }
};

/**
 * getReviews - Controller function to retrieve reviews for a specific movie.
 * 
 * @param {Object} req - Express request object containing movieId in req.params
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function for error handling
 */
export const getReviews = async (req, res, next) => {
    try {
        const { movieId } = req.params;

        const result = await fetchReviewsByMovie(movieId);
        const reviews = result.rows;

        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        next(new ApiError("Error retrieving reviews", 500, error));
    }
};

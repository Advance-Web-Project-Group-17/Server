/**
 * reviewModel.js
 * 
 * Database functions for managing movie reviews in the database.
 * 
 * Functions:
 * - insertReview: Inserts a new review into the database.
 * - fetchReviewsByMovie: Retrieves all reviews for a specified movie.
 * 
 * Imports:
 * - query: Database query function for interacting with the PostgreSQL database.
 */

import { query } from "../helpers/db.js";

/**
 * insertReview - Model function to add a review to the database.
 * 
 * @param {number} user_id - ID of the user submitting the review
 * @param {number} movie_id - ID of the movie being reviewed
 * @param {string} review_text - Text content of the review
 * @param {number} rating - Rating of the movie (1-5 scale)
 * @returns {Promise} - Returns a promise that resolves with the inserted review data
 */
export const insertReview = async (user_id, movie_id, review_text, rating) => {
    return await query(
    `INSERT INTO reviews (user_id, tmdb_id, review_text, rating, reviewer_email) 
        VALUES ($1, $2, $3, $4, (SELECT email FROM users WHERE user_id = $1))
        RETURNING review_id, user_id, tmdb_id AS movie_id, review_text, rating, created_at`,
    [user_id, movie_id, review_text, rating]
    );
};

/**
 * fetchReviewsByMovie - Model function to retrieve reviews for a movie.
 * 
 * @param {number} movie_id - TMDB ID of the movie to retrieve reviews for
 * @returns {Promise} - Returns a promise that resolves with the list of reviews for the specified movie
 */
export const fetchReviewsByMovie = async (movie_id) => {
    return await query(
    `SELECT r.review_id, r.user_id, u.user_name, r.review_text, r.rating, r.created_at
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.tmdb_id = $1
        ORDER BY r.created_at DESC`,
    [movie_id]
    );
};

import { query } from "../helpers/db.js";

// Add a favorite for a user
const insertFavorite = async (user_id, movie_id, type) => {
    return await query(
        `INSERT INTO favorites (user_id, movie_id, type) 
         VALUES ($1, $2, $3) 
         RETURNING favorite_id, movie_id, type, created_at`,
        [user_id, movie_id, type]
    );
};

// Get all favorites for a user
const getUserFavorites = async (user_id) => {
    return await query(
        `SELECT * 
         FROM favorites 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [user_id]
    );
};

// Get shared favorites by username
const getSharedFavorites = async (username) => {
    return await query(
        `SELECT f.favorite_id, f.movie_id, f.title, f.type, f.created_at 
         FROM favorites f
         INNER JOIN users u ON f.user_id = u.user_id
         WHERE u.user_name = $1 AND f.is_shared = TRUE
         ORDER BY f.created_at DESC`,
        [username]
    );
};

// Toggle sharing status for all favorites of a user
const toggleFavoriteSharing = async (user_id, is_shared) => {
    return await query(
        `UPDATE favorites 
         SET is_shared = $1 
         WHERE user_id = $2 
         RETURNING favorite_id, movie_id, title, type, is_shared, created_at`,
        [is_shared, user_id]
    );
};

// Remove a favorite for a user
const deleteFavorite = async (user_id, movie_id) => {
    return await query(
        `DELETE FROM favorites 
         WHERE user_id = $1 AND movie_id = $2 
         RETURNING favorite_id, movie_id, title, type`,
        [user_id, movie_id]
    );
};

// Check if a favorite exists for a user and a specific movie/TV show
const isFavoriteExists = async (user_id, movie_id) => {
    return await query(
        `SELECT favorite_id 
         FROM favorites 
         WHERE user_id = $1 AND movie_id = $2`,
        [user_id, movie_id]
    );
};

export {
    insertFavorite,
    getUserFavorites,
    getSharedFavorites,
    toggleFavoriteSharing,
    deleteFavorite,
    isFavoriteExists,
};
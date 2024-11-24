import { searchMoviesByCriteria } from '../models/SearchMovie.js';

const searchMovies = async (req, res, next) => {
  try {
    const { title, genre, release_year, rating } = req.query;

    // Log incoming query parameters
    console.log('Received query parameters:', req.query);

    // Ensure at least one parameter is provided
    if (!title && !genre && !release_year && !rating) {
      return res.status(400).json({ message: "At least one search parameter (title, genre, release_year, rating) is required." });
    }

    // Use searchMoviesByCriteria to fetch and filter movies
    const movies = await searchMoviesByCriteria(title, genre, release_year, rating);

    // Return results
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error in searchMovies controller:", error.message);
    next(error); // Pass to error handling middleware
  }
};

export { searchMovies };

import { searchMoviesByCriteria } from '../models/Movie.js';

const searchMovies = async (req, res, next) => {
  try {
    const { title, genre, release_year, rating } = req.query;
    const movies = await searchMoviesByCriteria(title, genre, release_year, rating);
    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    next(error);
  }
};

export { searchMovies };

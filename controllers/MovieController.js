/*import { searchMoviesByCriteria } from '../models/Movie.js';

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

export { searchMovies };*/


/*

chatgpt

import { searchMovies as searchMoviesService } from '../services/tmdbService.js';

const searchMovies = async (req, res, next) => {
  try {
    const { title, genre, release_year, rating } = req.query;
    const movies = await searchMoviesService(title, genre, release_year, rating);
    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    next(error);
  }
};

export { searchMovies };*/


/*import { searchMovies as searchMoviesService } from '../services/tmdbService.js';

const searchMovies = async (req, res, next) => {
  try {
    const { title, genre, release_year, rating } = req.query;
    const movies = await searchMoviesService(title, genre, release_year, rating);
    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    next(error);
  }
};

export { searchMovies };*/


import { searchMovies as searchMoviesService } from '../services/tmdbService.js';

const searchMovies = async (req, res, next) => {
  try {
    const { title, genre, release_year, rating } = req.query;

    // Log incoming query parameters for debugging
    console.log('Received query parameters:', req.query);

    // If no search parameters are provided, return a message
    if (!title && !genre && !release_year && !rating) {
      return res.status(400).json({ message: "At least one search parameter (title, genre, release_year, rating) is required." });
    }

    // Call the searchMoviesService function with query parameters
    const movies = await searchMoviesService(title, genre, release_year, rating);

    // Return the search results
    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    next(error);  // Pass the error to the error handling middleware
  }
};

export { searchMovies };



/*import { searchMovies as searchMoviesService } from '../services/tmdbService.js';

const searchMovies = async (req, res, next) => {
  try {
    const { title, genre, release_year, rating } = req.query;

    // Log incoming query parameters for debugging
    console.log('Received query parameters:', req.query);

    // If no search parameters are provided, return a message
    if (!title && !genre && !release_year && !rating) {
      return res.status(400).json({ message: "At least one search parameter (title, genre, release_year, rating) is required." });
    }

    // Call the searchMoviesService function with query parameters
    const movies = await searchMoviesService(title, genre, release_year, rating);

    // If no movies found, return an empty array or message
    if (movies.length === 0) {
      return res.status(200).json({ message: "No movies found matching your criteria." });
    }

    // Return the search results
    return res.status(200).json(movies);
    
  } catch (error) {
    console.error("Error fetching movies:", error);
    next(error);  // Pass the error to the error handling middleware
  }
};

export { searchMovies };*/



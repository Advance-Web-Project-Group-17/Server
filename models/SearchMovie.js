import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetches movies from TMDB and filters based on criteria.
 */
const searchMoviesByCriteria = async (title, genre, release_year, rating) => {
  try {
    const genreMap = await fetchGenreMap();
    let movies = [];

    if (title) {
      // Search movies by title
      movies = await fetchMoviesByTitle(title);
    } else {
      // Fetch movies from TMDB discover API
      const params = {
        api_key: TMDB_API_KEY,
        year: release_year || '',
      };

      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });

      if (response.status !== 200) {
        throw new Error(`TMDB API error: ${response.statusText}`);
      }

      movies = response.data.results || [];
    }

    // Apply genre filter
    if (genre) {
      const genreId = getGenreIdByName(genre, genreMap);
      if (genreId) {
        movies = movies.filter(movie => movie.genre_ids.includes(genreId));
      }
    }

    // Apply release year filter
    if (release_year) {
      movies = movies.filter(movie => {
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear === parseInt(release_year, 10);
      });
    }

    // Apply rating filter
    if (rating) {
      movies = movies.filter(movie => movie.vote_average >= parseFloat(rating));
    }

    // Map genre names to movies
    return movies.map(movie => ({
      ...movie,
      genres: movie.genre_ids.map(id => genreMap[id]),
    }));
  } catch (error) {
    console.error('Error in searchMoviesByCriteria:', error.message);
    throw error;
  }
};

/**
 * Fetches movies by title using the search/movie endpoint.
 */
const fetchMoviesByTitle = async (title) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
      },
    });

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching movies by title:', error.message);
    throw error;
  }
};

/**
 * Fetches and constructs a map of genre IDs to names.
 */
const fetchGenreMap = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch genres');
    }

    return response.data.genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    throw error;
  }
};

/**
 * Finds the genre ID by its name.
 */
const getGenreIdByName = (name, genreMap) => {
  const lowerCaseName = name.toLowerCase();
  for (const [id, genreName] of Object.entries(genreMap)) {
    if (genreName.toLowerCase() === lowerCaseName) {
      return parseInt(id, 10);
    }
  }
  return null;
};

export { searchMoviesByCriteria };

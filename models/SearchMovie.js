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
    // Fetch genre mapping
    const genreMap = await fetchGenreMap();

    // Build query parameters for TMDB API
    const params = {
      api_key: TMDB_API_KEY,
      query: title || '',
      year: release_year || '',
    };

    console.log('Constructed TMDB API params:', params);

    // Fetch movies from TMDB API
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    let movies = response.data.results || [];
    console.log(`Fetched ${movies.length} movies from TMDB.`);

    // Apply genre filter
    if (genre) {
      const genreId = getGenreIdByName(genre, genreMap);
      console.log(`Genre: ${genre}, Resolved Genre ID: ${genreId}`);
      if (genreId) {
        movies = movies.filter(movie => {
          console.log(`Checking movie: ${movie.title}, Genre IDs: ${movie.genre_ids}`);
          return movie.genre_ids.includes(genreId);
        });
      } else {
        console.log(`No matching genre ID found for genre: ${genre}`);
      }
    }

    // Apply release year filter
    if (release_year) {
      console.log(`Filtering by release year: ${release_year}`);
      movies = movies.filter(movie => {
        if (!movie.release_date) {
          return false; // Skip movies with no release date
        }
        const movieYear = new Date(movie.release_date).getFullYear();
        console.log(`Movie: ${movie.title}, Release Year: ${movieYear}`);
        return movieYear === parseInt(release_year, 10);
      });
    }

    // Apply rating filter
    if (rating) {
      console.log(`Filtering by rating >= ${rating}`);
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
 * Fetches and constructs a map of genre IDs to names.
 */
const fetchGenreMap = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?language=en`, {
      params: { api_key: TMDB_API_KEY },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch genres');
    }

    console.log('Fetched genres:', response.data.genres);

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

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetches TV shows from TMDB and filters based on criteria.
 */
const searchTvShowByCriteria = async (title, genre, release_year, rating) => {
  try {
    const genreMap = await fetchGenreMap();
    let tvShows = [];

    if (title) {
      // Search TV shows by title
      tvShows = await fetchTvShowByTitle(title);
    } else {
      // Fetch TV shows from TMDB discover API
      const params = {
        api_key: TMDB_API_KEY,
        first_air_date_year: release_year || '', // Use `first_air_date_year` for TV shows
      };

      const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, { params });

      if (response.status !== 200) {
        throw new Error(`TMDB API error: ${response.statusText}`);
      }

      tvShows = response.data.results || [];
    }

    // Apply genre filter
    if (genre) {
      const genreId = getGenreIdByName(genre, genreMap);
      if (genreId) {
        tvShows = tvShows.filter(tvShow => tvShow.genre_ids.includes(genreId));
      }
    }

    // Apply release year filter
    if (release_year) {
      tvShows = tvShows.filter(tvShow => {
        if (!tvShow.first_air_date) return false; // Use `first_air_date` for TV shows
        const tvShowYear = new Date(tvShow.first_air_date).getFullYear();
        return tvShowYear === parseInt(release_year, 10);
      });
    }

    // Apply rating filter
    if (rating) {
      tvShows = tvShows.filter(tvShow => tvShow.vote_average >= parseFloat(rating));
    }

    // Map genre names to TV shows
    return tvShows.map(tvShow => ({
      ...tvShow,
      genres: tvShow.genre_ids.map(id => genreMap[id]),
    }));
  } catch (error) {
    console.error('Error in searchTvShowByCriteria:', error.message);
    throw error;
  }
};

/**
 * Fetches TV shows by title using the search/tv endpoint.
 */
const fetchTvShowByTitle = async (title) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
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
    console.error('Error fetching TV shows by title:', error.message);
    throw error;
  }
};

/**
 * Fetches and constructs a map of genre IDs to names for TV shows.
 */
const fetchGenreMap = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
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

export { searchTvShowByCriteria };

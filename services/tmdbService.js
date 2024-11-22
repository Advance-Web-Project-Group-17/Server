/*import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (title, genre, release_year, rating) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        year: release_year,
        with_genres: genre,
        sort_by: rating
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;
  }
};

export { searchMovies };*/





/*import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (title, genre, release_year, rating) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        year: release_year,
        with_genres: genre,
        sort_by: rating,
      }
    });
    
    return response.data.results;  // Return movie results
  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;
  }
};

export { searchMovies };*/


/*import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Function to search movies based on various filters
const searchMovies = async (title, genre, release_year, rating) => {
  try {
    // Define the API request parameters
    const params = {
      api_key: TMDB_API_KEY,
      query: title,  // Search by movie title
      year: release_year,  // Filter by release year (optional)
      with_genres: genre,  // Filter by genre ID (optional)
      sort_by: rating ? 'vote_average.desc' : undefined,  // Sort by rating if provided
    };

    // Send GET request to TMDB API
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });

    // Get the list of movies from the response
    let movies = response.data.results || [];

    // Apply additional local filters for release year and rating
    if (release_year) {
      // If release year is passed, filter movies by that year
      movies = movies.filter(movie => new Date(movie.release_date).getFullYear() === parseInt(release_year));
    }

    if (rating) {
      // If rating is passed, filter movies by minimum rating
      movies = movies.filter(movie => movie.vote_average >= parseFloat(rating));
    }

    // Return filtered list of movies
    return movies;

  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;  // Rethrow the error for proper error handling
  }
};

export { searchMovies };*/



/*import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (title, genre, release_year, rating) => {
  try {
    // Prepare the parameters for the request
    const params = {
      api_key: TMDB_API_KEY,
      query: title,    // Search by movie title
      year: release_year,  // Filter by release year (optional)
      with_genres: genre,  // Filter by genre ID(s) (optional)
      sort_by: rating ? 'vote_average.desc' : undefined, // Sort by rating if provided
    };

    // Send the request to the TMDB API
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });

    // Return the list of movies from the response
    return response.data.results || [];

  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;  // Rethrow for error handling in controller
  }
};

export { searchMovies };*/

/*import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (title, genre, release_year, rating) => {
  try {
    // Prepare the parameters for the request
    const params = {
      api_key: TMDB_API_KEY,
      query: title || '',
      year: release_year || '',
      with_genres: genre || '',
      sort_by: rating ? 'vote_average.desc' : undefined,
    };

    // Log the API request URL for debugging
    console.log('API Request URL:', `${TMDB_BASE_URL}/search/movie`, { params });

    // Send the request to the TMDB API
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });

    // Log the response for debugging
    console.log('API Response:', response.data);

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    // Return the list of movies from the response
    return response.data.results || [];

  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;  // Rethrow for error handling in controller
  }
};

export { searchMovies };*/


// backend/services/tmdbService.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (title, genre, release_year, rating) => {
  try {
    const params = {
      api_key: TMDB_API_KEY,
      query: title || '',
      year: release_year || '',
      with_genres: genre || '',
      'vote_average.gte': rating || '', // Correct parameter for rating
    };

    console.log('Constructed API request params:', params); // Log constructed params

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });

    console.log('API Response:', response.data);
    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;
  }
};

export { searchMovies };









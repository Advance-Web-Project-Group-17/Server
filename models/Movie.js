import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const searchMoviesByCriteria = async (title, genre, release_year, rating) => {
  const apiKey = process.env.TMDB_API_KEY;
  let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US`;

  if (title) {
    apiUrl += `&query=${encodeURIComponent(title)}`;
  }

  const response = await fetch(apiUrl);
  const movies = await response.json();

  // Optionally filter results by genre, release year, and rating
  let filteredMovies = movies.results || [];
  if (genre) {
    const genreResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const genreList = await genreResponse.json();
    const genreMap = genreList.genres.reduce((map, obj) => {
      map[obj.id] = obj.name;
      return map;
    }, {});

    filteredMovies = filteredMovies.filter(movie => movie.genre_ids.some(id => genreMap[id].toLowerCase() === genre.toLowerCase()));
  }
  if (release_year) {
    filteredMovies = filteredMovies.filter(movie => new Date(movie.release_date).getFullYear() === parseInt(release_year));
  }
  if (rating) {
    filteredMovies = filteredMovies.filter(movie => movie.vote_average >= parseFloat(rating));
  }

  // Add genre names to the movie objects
  filteredMovies = filteredMovies.map(movie => ({
    ...movie,
    genres: movie.genre_ids.map(id => genreMap[id]),
  }));

  return filteredMovies;
};

export { searchMoviesByCriteria };

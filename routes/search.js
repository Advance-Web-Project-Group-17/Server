import express from 'express';
import { searchMovies } from '../controllers/SearchMovieController.js';
import { searchTvShows } from '../controllers/SearchTvShowController.js'

const router = express.Router();

// Movie search route
router.get('/movie', searchMovies);

//Tvshows search route
router.get('/tv', searchTvShows);

export { router as searchRouter };
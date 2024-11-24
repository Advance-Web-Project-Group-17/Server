import express from 'express';
import { searchMovies } from '../controllers/SearchController.js';

const router = express.Router();

// Movie search route
router.get('/search', searchMovies);

export { router as searchRouter };
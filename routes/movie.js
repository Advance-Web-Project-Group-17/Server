import express from 'express';
import { searchMovies } from './controllers/MovieController.js';

const router = express.Router();

router.get('/search', searchMovies);

export { router as movieRouter };

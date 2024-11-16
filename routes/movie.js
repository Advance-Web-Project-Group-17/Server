import express from 'express';
import { searchMovies } from '../controllers/movieController.js';



const router = express.Router();

router.get('/search', searchMovies);

export { router as movieRouter };

import express from 'express';
import { createGroup, listGroups } from '../controllers/GroupController.js';
import { verifyToken } from '../helpers/authMiddleware.js';  // Import authentication middleware

// Create a new router instance
const groupRouter = express.Router();

// Route to create a group, protected by the authentication middleware
groupRouter.post('/create', verifyToken, createGroup);

// Route to list all groups, protected by the authentication middleware
groupRouter.get('/list', verifyToken, listGroups);

export { groupRouter };

/**
 * authMiddleware.js
 * 
 * Middleware function for authenticating users using JWT.
 * 
 * Features:
 * - Validates the JWT token in the Authorization header.
 * - Attaches the decoded user information to the request object.
 * - Handles errors for missing or invalid tokens consistently.
 */

import jwt from "jsonwebtoken";
import { ApiError } from "../helpers/ApiError.js";

/**
 * authenticateToken - Middleware function to authenticate users using JWT.
 * 
 * @param {Object} req - Express request object containing headers.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for passing control to the next middleware.
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      throw new ApiError("Unauthorized: No token provided", 401); // Missing token
    }

    // Ensure the secret key is defined
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not defined in environment variables");
      throw new ApiError("Internal Server Error: Missing server configuration", 500);
    }

    // Verify the token
    console.log("JWT_SECRET in authMiddleware:", secretKey);
    console.log('Incoming JWT:', token);
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded: ', decoded);

    // Attach the decoded user information to the request object
    req.user = decoded; // e.g., { user_id: 123, email: "user@example.com" }
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Error in authenticateToken:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError("Unauthorized: Invalid token", 403));
    } else {
      next(error); // Pass all other errors to the global error handler
    }
  }
};

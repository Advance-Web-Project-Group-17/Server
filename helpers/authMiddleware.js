import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return next(new ApiError("Access denied. No token provided.", 403));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Add user data to request
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return next(new ApiError("Invalid token!", 403));
  }
};

export { verifyToken };

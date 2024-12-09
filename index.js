import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user.js"
import { reviewRouter } from "./routes/review.js"
import { searchRouter } from "./routes/search.js"
import { groupRouter } from "./routes/group.js"
import { favoritesRouter } from "./routes/favorites.js"

const environment = process.env.NODE_ENV;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use("/", reviewRouter);
app.use("/movies", reviewRouter);
app.use("/search", searchRouter);
app.use("/group", groupRouter)
app.use("/favorites", favoritesRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack); // Log the error stack for debugging

  const statusCode = err.statusCode || 500; // Default to 500 if no status is set
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(err.details && { details: err.details }), // Include error details if available
  });
});

//Test is the azure working
app.get("/", (req, res) => {
  res.send("Server is running");
})

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

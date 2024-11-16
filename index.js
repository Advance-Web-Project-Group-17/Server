/*import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user.js"

const environment = process.env.NODE_ENV;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

app.use('/user', userRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});*/

/*import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Movie App API!');
});

app.use('/user', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});*/



// To integrate both the user and movie routes, updated  index.js file  is as follows:


import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.js";
import { movieRouter } from "./routes/movie.js"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

app.use('/user', userRouter);
app.use('/movie', movieRouter); 

// Optional: Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Movie App API!');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});










/*import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.js";
// New import for movieRouter
import { movieRouter } from "./routes/movie.js";

const environment = process.env.NODE_ENV;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

// Register existing user routes
app.use('/user', userRouter);
// New code: Register movie routes
app.use('/movie', movieRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});*/


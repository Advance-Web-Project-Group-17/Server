import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user.js"
import { reviewRouter } from "./routes/review.js"

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
app.use("/", reviewRouter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

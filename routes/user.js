import express from "express"
import { postRegister, postLogin, confirmUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Register
userRouter.post("/register", postRegister);

// Login
userRouter.post("/login", postLogin);

// Confirm email
userRouter.get("/confirm/:token", confirmUser);

export { userRouter };

import express from "express"
import { postRegister, postLogin, confirmUser, deleteUser } from "../controllers/UserController.js";

const userRouter = express.Router();

// Register
userRouter.post("/register", postRegister);

// Login
userRouter.post("/login", postLogin);

// Confirm email
userRouter.get("/confirm/:token", confirmUser);

//Delete user
userRouter.delete("/delete/:user_id", deleteUser);

export { userRouter };
/*import express from "express"
import { postRegister, postLogin, confirmUser } from "../controllers/UserController.js";

const userRouter = express.Router();

// Register
userRouter.post("/register", postRegister);

// Login
userRouter.post("/login", postLogin);

// Confirm email
userRouter.get("/confirm/:token", confirmUser);

export { userRouter };*/





//updated file to include the route for account deletion.


import express from "express";
import { postRegister, postLogin, confirmUser, deleteUser } from "../controllers/UserController.js"; // Import deleteUser

const userRouter = express.Router();

// Register
userRouter.post("/register", postRegister);

// Login
userRouter.post("/login", postLogin);

// Confirm email
userRouter.get("/confirm/:token", confirmUser);

// Delete account
userRouter.delete("/delete", deleteUser); // Add delete account route

export { userRouter };





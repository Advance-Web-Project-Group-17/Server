import express from "express"
import { postRegister, postLogin, confirmUser, deleteUser, getUserProfile, editUserProfile, getUserGroupName, updateSharedProfile, getUserSharedProfile } from "../controllers/UserController.js";

const userRouter = express.Router();

// Register
userRouter.post("/register", postRegister);

// Login
userRouter.post("/login", postLogin);

// Confirm email
userRouter.get("/confirm/:token", confirmUser);

//Delete user
userRouter.post("/delete/:user_id", deleteUser);

//Get user's profile
userRouter.get("/profile/:user_id", getUserProfile);

//Edit user's profile
userRouter.put("/profile/edit/:user_id", editUserProfile);

//Get user's group name
userRouter.get("/group/:user_id", getUserGroupName);

//Update shared profile 
userRouter.put("/profile/share", updateSharedProfile);

//Get user's shared profile
userRouter.get("/shared", getUserSharedProfile);

export { userRouter };
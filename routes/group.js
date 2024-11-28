import express from "express"
import { createGroup, takeAllGroup, takeGroupBasedOnId, deleteGroup, addMemberToGroup, removeMemberFromGroup, grantMemberAdmin, addMovieToGroup, getGroupMovies, deleteMove, takeMemberName } from "../controllers/GroupController.js";

const groupRouter = express.Router();

//Create group
groupRouter.post("/create", createGroup);

//Get all group
groupRouter.get("/getGroup", takeAllGroup);

//Get group based on id
groupRouter.get("/getGroup/:group_id", takeGroupBasedOnId);

//Remove group
groupRouter.delete("/removeGroup/:group_id", deleteGroup);

//Add member to group
groupRouter.post("/addMember", addMemberToGroup);

//Remove member from group
groupRouter.delete("/removeMember", removeMemberFromGroup);

//Get member
groupRouter.get("/getMember/:group_id", takeMemberName);

//Grant member admin
groupRouter.put("/grantAdmin/:group_id", grantMemberAdmin);

//Add movie to group
groupRouter.post("/addMovie", addMovieToGroup);

//Get movie
groupRouter.get("/getMovie/:group_id", getGroupMovies);

//Delete movie
groupRouter.delete("/deleteMovie/:group_id", deleteMove);

export {groupRouter}


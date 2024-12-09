import express from "express"
import { createGroup, takeAllGroup, takeGroupBasedOnId, deleteGroup, addMemberToGroup, removeMemberFromGroup, grantMemberAdmin, addMovieToGroup, getGroupMovies, deleteMove, takeMemberName, takeUserGroup, addTvShowToGroup, getGroupTvShow, checkMemberInGroup, outGroup, checkIsAdmin, deleteTvShow } from "../controllers/GroupController.js";

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

//Add tv show to group
groupRouter.post("/addTvShow", addTvShowToGroup);

//Get movie
groupRouter.get("/getMovie/:group_id", getGroupMovies);

//Get tv show
groupRouter.get("/getTvShow/:group_id", getGroupTvShow);

//Delete movie
groupRouter.delete("/deleteMovie/:group_id", deleteMove);

//Delete tv show
groupRouter.delete("/deleteTvShow/:group_id", deleteTvShow);

//Get users' group
groupRouter.get("/getUserGroup/:user_id", takeUserGroup);

//Check member in group
groupRouter.post("/checkMember/:group_id", checkMemberInGroup);

//Out group
groupRouter.delete("/outGroup/:group_id", outGroup);

//Check is admin
groupRouter.post("/checkAdmin", checkIsAdmin)

export {groupRouter}


import {
  addGroup,
  addMember,
  getGroup,
  removeMember,
  removeGroup,
  adminMember,
  addMovie,
  checkAdmin,
  checkMember,
  getMovie,
  removeMovie,
  getMember
} from "../models/GroupModel.js";
import axios from "axios";

const api_key = process.env.API_KEY;

export const createGroup = async (req, res, next) => {
  try {
    const { group_name, user_id } = req.body;
    const result = await addGroup(group_name);
    const group_id = result.rows[0].group_id;
    await addMember(group_id, user_id);
    const admin = await adminMember(user_id);
    res.status(200).json({
      message: "Group created successfully",
      response: result.rows[0],
      admin: admin.rows,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const takeAllGroup = async (req, res, next) => {
  try {
    const result = await getGroup();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const takeGroupBasedOnId = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    const result = await getGroup(group_id);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const { group_id } = req.params;

    if (!group_id || !user_id) {
      return res
        .status(400)
        .json({ message: "group_id, user_id are required" });
    }

    // Check if the user is a member of the group
    const resultCheckMember = await checkMember(user_id, group_id);
    if (!resultCheckMember?.rows || resultCheckMember.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of the specified group" });
    }

    // Check admin status
    const resultCheckAdmin = await checkAdmin(user_id);
    if (!resultCheckAdmin?.rows || resultCheckAdmin.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Admin status could not be verified" });
    }

    const isAdmin = resultCheckAdmin.rows[0].is_admin;
    if (resultCheckMember.rows[0].group_id == group_id && isAdmin === false) {
      return res.status(403).json({ message: "You are not an admin" });
    }

    await removeGroup(group_id);

    res.status(200).json({
      message: "Delete group successfully",
      res: resultCheckAdmin.rows[0],
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const addMemberToGroup = async (req, res, next) => {
  try {
    const { group_id, user_id } = req.body;
    await addMember(group_id, user_id);
    res.status(200).json({ message: "Member added to group successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const removeMemberFromGroup = async (req, res, next) => {
  try {
    const { group_id, user_id, removed_id } = req.body;

    if (!group_id || !user_id || !removed_id) {
      return res
        .status(400)
        .json({ message: "group_id, user_id, and removed_id are required" });
    }

    // Check if the user is a member of the group
    const resultCheckMember = await checkMember(user_id, group_id);
    if (!resultCheckMember?.rows || resultCheckMember.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of the specified group" });
    }

    // Check admin status
    const resultCheckAdmin = await checkAdmin(user_id);
    if (!resultCheckAdmin?.rows || resultCheckAdmin.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Admin status could not be verified" });
    }

    const isAdmin = resultCheckAdmin.rows[0].is_admin;
    if (resultCheckMember.rows[0].group_id == group_id && isAdmin === false) {
      return res.status(403).json({ message: "You are not an admin" });
    }

    // Proceed to remove the member
    await removeMember(group_id, removed_id);

    res.status(200).json({
      message: "Member removed from group successfully",
      res: resultCheckAdmin.rows[0],
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const grantMemberAdmin = async (req, res, next) => {
  try {
    const { grantedMemberId, user_id } = req.body;
    const { group_id } = req.params;

    // Validate inputs
    if (!grantedMemberId || !user_id || !group_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user is a member of the group
    const resultCheckMember = await checkMember(user_id, group_id);
    if (!resultCheckMember?.rows || resultCheckMember.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of the specified group" });
    }

    // Check if the granted member is a member of the group
    const resultCheckGrantedMember = await checkMember(
      grantedMemberId,
      group_id
    );
    if (
      !resultCheckGrantedMember?.rows ||
      resultCheckGrantedMember.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Granted user is not a member of the specified group",
      });
    }

    // Check if the user is an admin
    const resultCheckAdmin = await checkAdmin(user_id);
    const isAdmin = resultCheckAdmin.rows[0]?.is_admin || false;
    if (!isAdmin) {
      return res.status(403).json({ message: "You are not an admin" });
    }

    // Grant admin rights
    await adminMember(grantedMemberId);
    res.status(200).json({ message: "Admin granted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    next(error);
  }
};

export const addMovieToGroup = async (req, res, next) => {
  try {
    const { group_id, movie_id, user_id } = req.body;
    const resultCheckMember = await checkMember(user_id, group_id);
    if (!resultCheckMember?.rows || resultCheckMember.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of the specified group" });
    }
    await addMovie(group_id, movie_id, user_id);
    res.status(200).json({ message: "Movie added to group successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getGroupMovies = async (req, res, next) => {
  const { group_id } = req.params;

  try {
    const groupMovies = await getMovie(group_id);
    const movieIds = groupMovies.rows.map((movie) => movie.movie_id);

    const movieDetails = await Promise.all(
      movieIds.map(async (movieId) => {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`
        );
        return response.data;
      })
    );

    res.status(200).json({ movies: movieDetails });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteMove = async (req, res, next) => {
  const { group_id } = req.params
  const { movie_id } = req.body
  try{
    const response = await removeMovie(group_id, movie_id);
    res.status(200).json({message: "Movie removed from group successfully", group: response.rows[0].group_id})
  }catch(error){
    console.log(error)
    next(error)
  } 
}

export const takeMemberName = async(req, res, next) => {
  try{
    const {group_id} = req.params;
    const response = await getMember(group_id);
    res.status(200).json(response.rows)
  }catch(error){
    console.log(error)
    next(error)
  }
}
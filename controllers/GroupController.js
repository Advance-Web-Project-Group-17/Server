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
  getMember,
  getUserGroup,
  addTv,
  getTv,
  getMemberNickName, 
  checkGroupAdmin
} from "../models/GroupModel.js";
import axios from "axios";
import { checkNumberAdmin } from "../models/User.js";

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

    if(removed_id == user_id) {
      return res.status(400).json({ message: "You cannot remove yourself" });
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

export const addTvShowToGroup = async (req, res, next) => {
  try {
    const { group_id, tv_id, user_id } = req.body;
    const resultCheckMember = await checkMember(user_id, group_id);
    if (!resultCheckMember?.rows || resultCheckMember.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of the specified group" });
    }
    await addTv(group_id, tv_id, user_id);
    res.status(200).json({ message: "Movie added to group successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};



export const getGroupMovies = async (req, res, next) => {
  const { group_id } = req.params;

  try {
    // Retrieve the group movies
    const groupMovies = await getMovie(group_id);
    const movieIds = groupMovies.rows.map((movie) => movie.movie_id);

    // Fetch details for each movie ID
    const movieDetails = await Promise.all(
      movieIds.map(async (movieId) => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`
          );
          return response.data;
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.warn(`Movie with ID ${movieId} not found.`);
            return null; // Skip movie if not found
          }
          throw err; // Re-throw for unexpected errors
        }
      })
    );

    // Filter out any null entries (movies not found)
    const validMovies = movieDetails.filter((movie) => movie !== null);

    res.status(200).json({ movies: validMovies });
  } catch (error) {
    console.error('Error fetching group movies:', error.message);
    next(error);
  }
};

export const getGroupTvShow = async (req, res, next) => {
  const { group_id } = req.params;

  try {
    // Retrieve the group movies
    const groupTvShows = await getTv(group_id);
    const tvShowIds = groupTvShows.rows.map((tv) => tv.tv_id);

    // Fetch details for each movie ID
    const tvShowDetails = await Promise.all(
      tvShowIds.map(async (tvShowId) => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.API_KEY}`
          );
          return response.data;
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.warn(`Movie with ID ${tvShowId} not found.`);
            return null; // Skip movie if not found
          }
          throw err; // Re-throw for unexpected errors
        }
      })
    );

    // Filter out any null entries (movies not found)
    const validTvShow = tvShowDetails.filter((tv) => tv !== null);

    res.status(200).json({ tvShows: validTvShow });
  } catch (error) {
    console.error('Error fetching group movies:', error.message);
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

export const takeUserGroup = async(req, res, next) => {
  try{
    const {user_id} = req.params;
    const response = await getUserGroup(user_id);
    res.status(200).json(response.rows)
  }catch(error){
    console.log(error)
    next(error)
  }
}

export const checkMemberInGroup = async(req, res, next) => {
  try{
    const { user_id } = req.body;
    const { group_id } = req.params
    const response = await getMemberNickName(user_id, group_id);
    if(response.rows.length > 0){
      res.status(200).json(response.rows)
    } else {
      res.status(404).json(false)
    }
  }catch(error){
    console.log(error)
    next(error)
  }
}

export const outGroup = async (req, res, next) => {
  try {
    const { removed_id } = req.body;
    const { group_id } = req.params;

    console.log(typeof removed_id)
    console.log("group" + group_id)
    // Check the number of admins in the group
    const resultCheckNumberAdmin = await checkNumberAdmin(group_id);

    if (resultCheckNumberAdmin.rowCount === 0) {
      return res.status(404).json({ message: "Group not found or no admins" });
    }

    if (resultCheckNumberAdmin.rows[0].count >= 2) {
      // Remove the member directly if there are more than one admin
      const response = await removeMember(group_id, removed_id);
      return res.status(200).json({ message: "Member removed", rows: response.rows });
    } else {
      // Check if the user to be removed is an admin
      const resultCheckAdmin = await checkGroupAdmin(removed_id, group_id);

      if (resultCheckAdmin.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      if (resultCheckAdmin.rows[0].is_admin === true) {
        return res.status(400).json({ message: "You are the only admin of this group" });
      } else {
        // Remove the member
        const response = await removeMember(group_id, removed_id);
        return res.status(200).json({ message: "Member removed", rows: response.rows });
      }
    }
  } catch (error) {
    console.error("Error in outGroup:", error);
    next(error);
  }
};

export const checkIsAdmin = async (req, res, next) => {
  try {
    const { group_id, user_id } = req.body;

    console.log("Received group_id:", group_id, "user_id:", user_id);

    // Check if user is an admin in the group
    const response = await checkGroupAdmin(user_id, group_id);

    // Check if rows is not empty and then check the is_admin field
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "User not found in the group" });
    }

    if (response.rows[0].is_admin === true) {
      return res.status(200).json({ is_admin: true });
    } else {
      return res.status(400).json({ is_admin: false });
    }
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


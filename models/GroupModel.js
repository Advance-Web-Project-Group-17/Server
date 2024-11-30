import { query } from "../helpers/db.js";

//Get group
const getGroup = async (group_id) => {
    if(group_id){
        return await query("select * from groups where group_id = $1", [group_id])
    }
    return await query("select * from groups")
}

//Create group
const addGroup = async (group_name) => {
    return await query("insert into groups (group_name) values ($1) returning group_id", [group_name])
}

//Remove group
const removeGroup = async (group_id) => {
    await query("delete from group_membership where group_id =$1", [group_id])
    return await query("delete from groups where group_id = $1", [group_id])
}

//Add member
const addMember = async (group_id, user_id) => {
    return await query("insert into group_membership (group_id, user_id) values ($1, $2)", [group_id, user_id])
}

//Get member
const getMember = async (group_id) => {
    return await query("select users.nick_name, users.user_id from users join group_membership on users.user_id=group_membership.user_id where group_id = $1" ,[group_id]);
}

//Admid member
const adminMember = async (user_id) => {
    return await query("update group_membership set is_admin = true where user_id = $1 returning user_id", [user_id])
}

//Check is_admin
const checkAdmin = async(user_id) => {
    return await query("select is_admin from group_membership where user_id = $1", [user_id])
}

//Check is member
const checkMember = async(user_id, group_id) => {
    return await query("SELECT * FROM group_membership WHERE user_id = $1 AND group_id = $2", [user_id, group_id])
}

//Remove member
const removeMember = async (group_id, removed_id) => {
    return await query("delete from group_membership where group_id = $1 and user_id = $2", [group_id, removed_id])
}

//Add movie
const addMovie = async (group_id, movie_id, user_id) => {
    return await query("insert into group_movie (group_id, movie_id, user_id) values ($1, $2, $3)", [group_id, movie_id, user_id])
}

//Add tv show
const addTv = async (group_id, tv_id, user_id) => {
    return await query("insert into group_tv (group_id, tv_id, user_id) values ($1, $2, $3)", [group_id, tv_id, user_id])
}

//Get movie
const getMovie = async(group_id) => {
    return await query("select * from group_movie where group_id = $1", [group_id])
}

//Get Tv Show
const getTv = async(group_id) => {
    return await query("select * from group_tv where group_id = $1", [group_id])
}

//Remove movie
const removeMovie = async (group_id, movie_id) => {
    return await query("delete from group_movie where group_id = $1 and movie_id = $2 returning group_id", [group_id, movie_id])
}

//Get user's group
const getUserGroup = async(user_id) => {
    return await query("SELECT groups.* FROM groups JOIN group_membership ON groups.group_id = group_membership.group_id WHERE group_membership.user_id = $1", [user_id])
}

export {getGroup, addGroup, addMember, removeMember, removeGroup, addMovie, adminMember, checkAdmin, checkMember, getMovie, removeMovie, getMember, getUserGroup, addTv, getTv}
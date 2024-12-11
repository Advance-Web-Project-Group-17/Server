import { query } from "../helpers/db.js";

const insertUser = async (email, user_name, hashedPassword) => {
    return await query('insert into users (email, user_name, password) values ($1, $2, $3) returning user_id, user_name', [email, user_name, hashedPassword]);
}

const getUser = async (user_name) => {
    return await query('select users.*, group_membership.is_admin from users left join group_membership on users.user_id=group_membership.user_id where users.user_name = $1', [user_name]);    
}

const getUserId = async (user_id) => {
    return await query('select * from users where user_id = $1', [user_id]);
}

const getUserGroup = async(user_id) => {
    return await query("select * from group_membership where user_id = $1", [user_id])
}

const getGroupName = async(group_id) => {
    return await query("select * from groups where group_id = $1", [group_id])
}

const updateUserStatus = async (user_id, is_confirmed) => {
    return await query('UPDATE users SET is_confirmed = $1 WHERE user_id = $2', [is_confirmed, user_id]);
};

const checkNumberAdmin = async (group_id) => {
    return await query("select count(user_id) from group_membership where group_id = $1 and is_admin = true ", [group_id])
}

const checkIsAdmin = async(user_id) => {
    return await query("select is_admin from group_membership where user_id = $1", [user_id])
}

const deleteUserById = async (user_id) => {
    // Delete related records first to ensure foreign key constraints are not violated
    await query("DELETE FROM group_membership WHERE user_id = $1", [user_id]);
    await query("DELETE FROM notification WHERE user_id = $1", [user_id]);
    await query("DELETE FROM reviews WHERE user_id = $1", [user_id]);
    await query("DELETE FROM favorites WHERE user_id = $1", [user_id]);
  
    // Finally, delete the user
    return await query("DELETE FROM users WHERE user_id = $1", [user_id]);
  };

const updateUserProfile = async (user_id, location, nick_name) => {
    return await query("update users set location = $1, nick_name = $2 where user_id = $3", [location, nick_name, user_id])
}

const shareProfile = async(user_id, is_shared) => {
    return await query("update users set is_shared = $1 where user_id = $2", [is_shared, user_id])
}

const getSharedProfile = async() => {
    return await query("select * from users where is_shared = true")
}

export { insertUser, getUser, updateUserStatus, deleteUserById, getUserId, updateUserProfile, getUserGroup, checkIsAdmin, checkNumberAdmin, getGroupName, shareProfile, getSharedProfile }
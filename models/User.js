/*import { query } from "../helpers/db.js";

const insertUser = async (email, user_name, hashedPassword) => {
    return await query('insert into users (email, user_name, password) values ($1, $2, $3) returning user_id, user_name', [email, user_name, hashedPassword]);
}

const getUser = async (user_name) => {
    return await query('select * from users where user_name = $1', [user_name]);    
}

const updateUserStatus = async (user_id, is_confirmed) => {
    return await query('UPDATE users SET is_confirmed = $1 WHERE user_id = $2', [is_confirmed, user_id]);
};


export { insertUser, getUser, updateUserStatus }*/


//updated file to include the deleteUserById function.


/*import { query } from "../helpers/db.js";

const insertUser = async (email, user_name, hashedPassword) => {
  return await query('insert into users (email, user_name, password) values ($1, $2, $3) returning user_id, user_name', [email, user_name, hashedPassword]);
};

const getUser = async (user_name) => {
  return await query('select * from users where user_name = $1', [user_name]);    
};

const updateUserStatus = async (user_id, is_confirmed) => {
  return await query('UPDATE users SET is_confirmed = $1 WHERE user_id = $2', [is_confirmed, user_id]);
};

const deleteUserById = async (userId) => {
  await query('DELETE FROM reviews WHERE user_id = $1', [userId]); // Example related data
  await query('DELETE FROM ratings WHERE user_id = $1', [userId]); // Example related data
  return await query('DELETE FROM users WHERE user_id = $1', [userId]);
};

export { insertUser, getUser, updateUserStatus, deleteUserById };*/

import { query } from "../helpers/db.js";

const insertUser = async (email, user_name, hashedPassword) => {
  return await query('insert into users (email, user_name, password) values ($1, $2, $3) returning user_id, user_name', [email, user_name, hashedPassword]);
};

const getUser = async (user_name) => {
  return await query('select * from users where user_name = $1', [user_name]);    
};

const updateUserStatus = async (user_id, is_confirmed) => {
  return await query('UPDATE users SET is_confirmed = $1 WHERE user_id = $2', [is_confirmed, user_id]);
};

// Modify this function to anonymize reviews and ratings instead of deleting them
const deleteUserById = async (userId) => {
  // Update the reviews and ratings to anonymize them
  await query('UPDATE reviews SET user_id = NULL, is_anonymous = TRUE WHERE user_id = $1', [userId]);
  await query('UPDATE ratings SET user_id = NULL, is_anonymous = TRUE WHERE user_id = $1', [userId]);

  // Now, delete the user record
  return await query('DELETE FROM users WHERE user_id = $1', [userId]);
};

export { insertUser, getUser, updateUserStatus, deleteUserById };










/*import { query } from "../helpers/db.js";

const insertUser = async (email, user_name, hashedPassword) => {
  return await query('INSERT INTO users (email, user_name, password) VALUES ($1, $2, $3) RETURNING user_id, user_name', [email, user_name, hashedPassword]);
};

const getUser = async (user_name) => {
  return await query('SELECT * FROM users WHERE user_name = $1', [user_name]);    
};

const updateUserStatus = async (user_id, is_confirmed) => {

  return await query('UPDATE users SET is_confirmed = $1 WHERE user_id = $2', [is_confirmed, user_id]);
};

const deleteUserById = async (userId) => {
  // Ensure no references to 'reviews' and 'ratings' tables
  // Only delete from 'users' table
  return await query('DELETE FROM users WHERE user_id = $1', [userId]);
};

export { insertUser, getUser, updateUserStatus, deleteUserById };*/





/*import { query } from "../helpers/db.js";

// Existing functions
const insertUser = async (email, user_name, hashedPassword) => {
    return await query('INSERT INTO users (email, user_name, password) VALUES ($1, $2, $3) RETURNING user_id, user_name', [email, user_name, hashedPassword]);
}

const getUser = async (user_name) => {
    return await query('SELECT * FROM users WHERE user_name = $1', [user_name]);    
}

const updateUserStatus = async (user_id, is_confirmed) => {
    return await query('UPDATE users SET is_confirmed = $1 WHERE user_id = $2', [is_confirmed, user_id]);
}

// New functions to delete user and related data
const deleteUser = async (user_id) => {
    await query('DELETE FROM group_membership WHERE user_id = $1', [user_id]); // Delete user from group_membership
    await query('DELETE FROM notifications WHERE user_id = $1', [user_id]); // Delete user notifications
    await query('DELETE FROM users WHERE user_id = $1', [user_id]); // Finally delete the user
};

const deleteUserReviews = async (user_id) => {
    return await query('DELETE FROM reviews WHERE user_id = $1', [user_id]);
};

const deleteUserFavorites = async (user_id) => {
    return await query('DELETE FROM favorites WHERE user_id = $1', [user_id]);
};

const deleteUserSharedFavorites = async (user_id) => {
    return await query('DELETE FROM shared_favorites WHERE user_id = $1', [user_id]);
}

// Export existing and new functions
export { insertUser, getUser, updateUserStatus, deleteUser, deleteUserReviews, deleteUserFavorites, deleteUserSharedFavorites };*/

import { query } from "../helpers/db.js";

const insertUser = async (email, user_name, hashedPassword) => {
    return await query('insert into users (email, user_name, password) values ($1, $2, $3) returning user_id, user_name', [email, user_name, hashedPassword]);
}

const getUser = async (user_name) => {
    return await query('select * from users where user_name = $1', [user_name]);    
}

export { insertUser, getUser }
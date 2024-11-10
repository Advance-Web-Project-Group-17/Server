import { insertUser, getUser } from '../models/User.js';
import { compare, hash } from "bcrypt";
import { ApiError } from "../helpers/ApiError.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;


const postRegister = async (req, res, next) => {
    try {
        if (!req.body.email || req.body.email.length == 0) {
            return res.status(400).json({ error: "Invalid email" });
        }
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const hashedPassword = await hash(req.body.password, 10);   
        const userFromDb = await insertUser(req.body.email, req.body.user_name, hashedPassword);
        const user = userFromDb.rows[0];
        
        // Wrap the response in an object
        return res.status(201).json({ user_id: user.user_id, user_name: user.user_name});
    } catch (error) {
        console.error(error);
        next(error);
    }
};




const createUserObject = (user_id,token=undefined) => {
    return {
        'id': user_id,
        ...(token !== undefined) && {'token': token}
    }
}

const postLogin = async (req, res, next) => {
    const invalid_credential_message = "Invalid credentials!"
    try{
        const userFromDb = await getUser(req.body.user_name)
        if(userFromDb.rows.length == 0) return next(new ApiError(invalid_credential_message, 401))

        const user = userFromDb.rows[0]
        if(!await compare(req.body.password,user.password)) return next(new ApiError("Wrong password", 401))

        const token = sign(req.body.user_name,process.env.JWT_SECRET_KEY)
        return res.status(200).json(createUserObject(user.user_id,token))
    }catch(error){
        console.error(error)
        next(error) 
    }
}

export { postRegister, postLogin}
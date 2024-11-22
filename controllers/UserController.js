import { insertUser, getUser, updateUserStatus } from "../models/User.js";
import { compare, hash } from "bcrypt";
import { ApiError } from "../helpers/ApiError.js";
import { sendConfirmationEmail } from "../helpers/emailService.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

const postRegister = async (req, res, next) => {
  try {
    const { email, user_name, password } = req.body;
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const hashedPassword = await hash(password, 10);
    const userFromDb = await insertUser(email, user_name, hashedPassword);
    const user = userFromDb.rows[0];

    // Generate a confirmation token
    const token = jwt.sign(
      { id: user.user_id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    ); //user data saved in sessionStorage will expired in 1h
    await sendConfirmationEmail(email, token);

    return res
      .status(201)
      .json({ message: "Registration successful. Please confirm your email." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const confirmUser = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    await updateUserStatus(decoded.id, true); // Updates `is_confirmed` field for user
    res.status(200).json({ message: "Email confirmed successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid or expired confirmation link." });
  }
};

const createUserObject = (user_id, token = undefined) => {
  return {
    id: user_id,
    ...(token !== undefined && { token: token }),
  };
};

const postLogin = async (req, res, next) => {
  const invalid_credential_message = "Invalid credentials!";
  try {
    const userFromDb = await getUser(req.body.user_name);
    if (userFromDb.rows.length == 0)
      return next(new ApiError(invalid_credential_message, 401));

    const user = userFromDb.rows[0];
    if (!user.is_confirmed) {
      return res
        .status(403)
        .json({ message: "Please confirm your email before logging in." });
    }
    
    if (!(await compare(req.body.password, user.password)))
      return next(new ApiError("Wrong password", 401));

    const token = sign(req.body.user_name, process.env.JWT_SECRET_KEY);
    return res.status(200).json(createUserObject(user.user_id, token));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { postRegister, postLogin, confirmUser };
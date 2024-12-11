import {
  insertUser,
  getUser,
  updateUserStatus,
  deleteUserById,
  getUserId,
  updateUserProfile,
  checkNumberAdmin,
  getUserGroup,
  checkIsAdmin,
  getGroupName,
  shareProfile,
  getSharedProfile
} from "../models/User.js";
import { compare, hash } from "bcrypt";
import { ApiError } from "../helpers/ApiError.js";
import { sendConfirmationEmail } from "../helpers/emailService.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

// const postRegister = async (req, res, next) => {
//   try {
//     const { email, user_name, password } = req.body;
//     if (!email || !password || password.length < 8) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const hashedPassword = await hash(password, 10);
//     const userFromDb = await insertUser(email, user_name, hashedPassword);
//     const user = userFromDb.rows[0];

//     // Generate a confirmation token
//     const token = jwt.sign(
//       { id: user.user_id, email },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "1h" }
//     ); //user data saved in sessionStorage will expired in 1h
//     await sendConfirmationEmail(email, token);

//     return res.status(201).json({
//       message: "Registration successful. Please confirm your email.",
//       user_id: user.user_id,
//       user_name: user.user_name,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

const postRegister = async (req, res, next) => {
  try {
    const { email, user_name, password } = req.body;
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const hashedPassword = await hash(password, 10);
    const userFromDb = await insertUser(email, user_name, hashedPassword);
    const user = userFromDb.rows[0];

    const token = jwt.sign(
      { id: user.user_id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    await sendConfirmationEmail(email, token);

    return res.status(201).json({
      message: "Registration successful. Please confirm your email.",
      user_id: user.user_id,
      user_name: user.user_name,
    });
  } catch (error) {
    console.error("Error in postRegister:", error.message);
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

const createUserObject = (user_id, token = undefined, is_admin) => {
  return {
    id: user_id,
    ...(token !== undefined && { token: token }),
    is_admin: is_admin
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
    return res.status(200).json(createUserObject(user.user_id, token, user.is_admin));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { password } = req.body;
    console.log("Password from request body:", password);
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const userFromDb = await getUserId(user_id);
    if (!userFromDb || !userFromDb.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userFromDb.rows[0];
    const resultGetUserGroup = await getUserGroup(user_id);
    const group_id = resultGetUserGroup.rows[0]?.group_id;

    // Check the password before querying other information
    if (!(await compare(password, user.password))) {
      return next(new ApiError("Wrong password", 401));
    }

    if (!group_id) {
      // User has no group, delete directly
      await deleteUserById(user_id);
      return res.status(200).json({ message: "User deleted successfully" });
    }

    const resultCheckAdmin = await checkNumberAdmin(group_id);
    const resultCheckIsAdmin = await checkIsAdmin(user_id);

    if (resultCheckIsAdmin.rows[0].is_admin) {
      // If user is admin, check if there are other admins in the group
      if (resultCheckAdmin.rows[0].count > 1) {
        await deleteUserById(user_id);
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(400).json({ message: "Admin cannot be deleted" });
      }
    } else {
      // If not an admin, delete user
      await deleteUserById(user_id);
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error); // Pass error to error handler middleware
  }
};


const getUserProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Check if user_id is provided
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }


    // Fetch user details
    const resultUser = await getUserId(user_id);
    if (resultUser.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = resultUser.rows[0];
    let response = {
      message: "User found.",
      user_name: user.user_name,
      nick_name: user.nick_name,
      location: user.location,
    };

    // Respond with the user profile
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error); // Pass the error to error handler middleware
  }
};


const editUserProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const { location, nick_name } = req.body;
    await updateUserProfile(user_id, location, nick_name);
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getUserGroupName = async (req, res, next) => {
  try {
    const { group_id } = req.params;
    if (!group_id) {
      return res.status(400).json({ message: "Group ID is required" });
    }
    const result = await getGroupName(group_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

const updateSharedProfile = async(req, res, next) => {
  try {
    const {user_id, is_shared} = req.body
    if (!is_shared || !user_id){
      return res.status(400).json({message: "User ID and is_shared status are required."})
    }
    await shareProfile(user_id, is_shared)
    res.status(200).json({message: "Profile sharing updated successfully."})
  }catch(error){
    console.log(error);
    next(error);
  }
}

const getUserSharedProfile = async(req, res, next) => {
  try {
    const result = await getSharedProfile();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export {
  postRegister,
  postLogin,
  confirmUser,
  deleteUser,
  getUserProfile,
  editUserProfile,
  getUserGroupName,
  updateSharedProfile,
  getUserSharedProfile
};

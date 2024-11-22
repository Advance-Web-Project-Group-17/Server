import { query } from "../helpers/db.js";

// Insert a new group into the database
const insertGroup = async (group_name, owner_id) => {
    return await query(
        'INSERT INTO groups (group_name, owner_id) VALUES ($1, $2) RETURNING group_id, group_name, owner_id, created_at', 
        [group_name, owner_id]
    );
};

// Retrieve all groups from the database
const getAllGroups = async () => {
    return await query(
        'SELECT * FROM groups'
    );
};

// Retrieve a group by its name (optional, for checking uniqueness)
const getGroupByName = async (group_name) => {
    return await query(
        'SELECT * FROM groups WHERE group_name = $1',
        [group_name]
    );
};

export { insertGroup, getAllGroups, getGroupByName };

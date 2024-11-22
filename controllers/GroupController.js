import { insertGroup, getAllGroups, getGroupByName } from '../models/Group.js';

// Controller to create a new group
export async function createGroup(req, res) {
    const { group_name } = req.body;
    const owner_id = req.user.id; // Use the authenticated user ID

    try {
        // Check if the group already exists by name
        const existingGroup = await getGroupByName(group_name);
        if (existingGroup.rows.length > 0) {
            return res.status(400).json({ error: 'Group name already exists' });
        }

        // Create a new group
        const newGroup = await insertGroup(group_name, owner_id);
        res.status(201).json(newGroup.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// Controller for listing all groups
export async function listGroups(req, res) {
    try {
        const groups = await getAllGroups();
        res.status(200).json(groups.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

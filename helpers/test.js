/*import fs from 'fs'
import path from 'path'
import { query } from './db.js'
import { hash } from "bcrypt";

const _dirname = import.meta.dirname

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(_dirname, '../db.sql'), 'utf-8')
    query(sql)
}

const insertUser = (email,password) => {
    hash(password,10,(error, hashedPassword) => {
        query('insert into account (email,password) values ($1, $2)', [email, hashedPassword] )
    })
}

export { initializeTestDb, insertUser }*/





//added a deleteTestUser function to test.js


/*import fs from 'fs';
import path from 'path';
import { query } from './db.js';
import { hash } from "bcrypt";

const _dirname = path.resolve();

// Function to initialize the test database
const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(_dirname, './db.sql'), 'utf-8');
    query(sql);
};

// Function to insert a test user
const insertUser = (email, password) => {
    hash(password, 10, (error, hashedPassword) => {
        query('insert into account (email, password) values ($1, $2)', [email, hashedPassword]);
    });
};

// Function to delete a test user
const deleteTestUser = (userId) => {
    return query('DELETE FROM account WHERE id = $1', [userId]);
};

export { initializeTestDb, insertUser, deleteTestUser };*/


/*import fs from 'fs';
import path from 'path';
import { query } from './db.js';
import { hash } from "bcrypt";

const _dirname = path.resolve();

// Function to initialize the test database
const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(_dirname, './db.sql'), 'utf-8');
    query(sql);
};

// Function to insert a test user
const insertUser = (email, password, user_name) => {
    hash(password, 10, (error, hashedPassword) => {
        query('INSERT INTO users (email, user_name, password) VALUES ($1, $2, $3)', [email, user_name, hashedPassword]);
    });
};

// Function to delete a test user
const deleteTestUser = (userId) => {
    return query('DELETE FROM users WHERE user_id = $1', [userId]);
};

export { initializeTestDb, insertUser, deleteTestUser };*/


/*import fs from 'fs';
import path from 'path';
import { query } from './db.js';
import { hash } from "bcrypt";

const _dirname = path.resolve();

// Function to initialize the test database
const initializeTestDb = async () => {
    try {
        const sql = fs.readFileSync(path.resolve(_dirname, './db.sql'), 'utf-8');
        await query(sql);  // Ensure it's run asynchronously
    } catch (error) {
        console.error('Error initializing test database:', error);
    }
};

// Function to insert a test user
const insertUser = async (email, password, user_name) => {
    try {
        const hashedPassword = await hash(password, 10);  // Using async/await for password hashing
        await query('INSERT INTO users (email, user_name, password) VALUES ($1, $2, $3)', [email, user_name, hashedPassword]);
    } catch (error) {
        console.error('Error inserting test user:', error);
    }
};

// Function to delete a test user
const deleteTestUser = async (userId) => {
    try {
        // Delete associated ratings and reviews if needed
        await query('UPDATE reviews SET user_id = NULL WHERE user_id = $1', [userId]);  // Make reviews anonymous
        await query('UPDATE ratings SET user_id = NULL WHERE user_id = $1', [userId]);  // Make ratings anonymous
        return await query('DELETE FROM users WHERE user_id = $1', [userId]);
    } catch (error) {
        console.error('Error deleting test user:', error);
    }
};

export { initializeTestDb, insertUser, deleteTestUser };*/



import fs from 'fs';
import path from 'path';
import { query } from './db.js';
import { hash } from "bcrypt";

const _dirname = path.resolve();

// Function to initialize the test database
const initializeTestDb = async () => {
    try {
        const sql = fs.readFileSync(path.resolve(_dirname, './db.sql'), 'utf-8');
        await query(sql);  // Ensure it's run asynchronously
    } catch (error) {
        console.error('Error initializing test database:', error);
    }
};

// Function to insert a test user
const insertUser = async (email, password, user_name) => {
    try {
        const hashedPassword = await hash(password, 10);  // Using async/await for password hashing
        await query('INSERT INTO users (email, user_name, password) VALUES ($1, $2, $3)', [email, user_name, hashedPassword]);
    } catch (error) {
        console.error('Error inserting test user:', error);
    }
};

// Function to delete a test user
const deleteTestUser = async (userId) => {
    try {
        // Make reviews and ratings anonymous (set user_id to NULL)
        await query('UPDATE reviews SET user_id = NULL WHERE user_id = $1', [userId]);  // Set user_id to NULL in reviews
        await query('UPDATE ratings SET user_id = NULL WHERE user_id = $1', [userId]);  // Set user_id to NULL in ratings

        // Delete the user
        return await query('DELETE FROM users WHERE user_id = $1', [userId]);
    } catch (error) {
        console.error('Error deleting test user:', error);
    }
};

export { initializeTestDb, insertUser, deleteTestUser };











/*create table users (
    user_id serial primary key,
    user_name varchar(100) unique not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    avatar varchar(255),
    nickName varchar(255),
    is_confirmed BOOLEAN DEFAULT FALSE
);
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE group_membership (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(group_id),
    PRIMARY KEY (group_id, user_id)
);

create table notification (
	noti_id serial primary key,
	user_id int not null,
	content varchar(255),
	constraint fk_user foreign key (user_id) references users(user_id)
)*/

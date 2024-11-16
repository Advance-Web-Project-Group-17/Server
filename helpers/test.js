import fs from 'fs'
import path from 'path'
import { query, testDbConnection } from './db.js'
import { hash } from "bcrypt";
import { fileURLToPath } from 'url';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(_dirname, '../db.sql'), 'utf-8')
    query(sql)
}

const insertTestUser = (user_name,password) => {
    hash(password,10,(error, hashedPassword) => {
        testDbConnection()
        query('insert into account (user_name,password) values ($1, $2)', [user_name, hashedPassword] )
    })
}

export { initializeTestDb, insertTestUser }
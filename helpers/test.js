import fs from 'fs'
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

export { initializeTestDb, insertUser }
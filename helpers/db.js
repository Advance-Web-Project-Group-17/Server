import dotenv from "dotenv"
import pkg from 'pg';

const { Pool } = pkg;

dotenv.config();  
console.log("Environment:", process.env.NODE_ENV);  // Add this line to verify


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.SSL
});

const query = (sql, values = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pool.query(sql, values);
      resolve(result);
    } catch (error) {
      reject(error.message);
    }
  });
};

export { query };

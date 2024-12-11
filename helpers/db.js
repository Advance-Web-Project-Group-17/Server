import dotenv from "dotenv"
import pkg from 'pg';

const { Pool } = pkg;

dotenv.config();  
console.log("Environment:", process.env.NODE_ENV);
console.log("Host", process.env.DB_HOST) 


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  } 
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

// In db.js, add a test function to check the connection
const testDbConnection = async () => {
  try {
    const res = await query("SELECT NOW()");
    console.log("Database connection successful:", res.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};


export { query, testDbConnection };

import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const {HOST, DATABASE, USER, PASSWORD, PORT } = process.env

// obtiene los valores de postgres desde el .env
export const pool = new Pool({
  host: HOST,
  database: DATABASE,
  user: USER,
  password: PASSWORD,
  port: PORT,
  allowExitOnIdle: true,
});

try {
  console.log("Database connected");
  await pool.query("SELECT NOW()");
  //console.log("Database connected after");
} catch (error) {
  console.log(error);
}

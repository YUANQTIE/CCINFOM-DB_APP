import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "process";

dotenv.config();
export let pool: mysql.Connection;

try {
    pool = await mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    });
    
    console.log("Connected to MySQL database");
}
catch(error){
    console.log("Failed to connect.");
    process.exit(1);
}

const [rows] = await pool.query("SELECT * FROM livestock");
console.log(rows);
// --- db.ts ---
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

let pool: mysql.Pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Test the connection
  (async () => {
    const connection = await pool.getConnection();
    console.log("Successfully connected to MySQL database pool.");
    connection.release();
  })();
} catch (error) {
  console.error("Failed to connect to MySQL database:", error);
  process.exit(1);
}

export { pool };

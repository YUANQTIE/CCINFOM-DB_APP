import mysql from "mysql2/promise";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
async function testQuery() {
    try {
        console.log("Connecting to database...");
        // Get a connection from the pool
        const connection = await pool.getConnection();
        console.log("Database connection successful!");
        // Execute a query
        // The [User[]] part is a TypeScript type assertion
        const [rows] = (await connection.execute("SELECT * FROM employees", [
            1,
        ]));
        // Release the connection back to the pool
        connection.release();
        if (rows.length > 0) {
            console.log("Query result:", rows);
        }
        else {
            console.log("No user found.");
        }
    }
    catch (error) {
        console.error("Error connecting to database or running query:", error);
    }
    finally {
        // Close the pool when your application shuts down
        // (This is just an example; you wouldn't normally do this here)
        await pool.end();
    }
}
// Run the test query
testQuery();
//# sourceMappingURL=db.js.map
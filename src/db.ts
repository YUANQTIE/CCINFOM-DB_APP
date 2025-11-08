import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "process";
import * as views from "./db_views.ts";
import { create } from "domain";

dotenv.config();
export let pool: mysql.Connection;
console.log(process.env.DB_HOST);

try {
  pool = await mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  });

  console.log("Connected to MySQL database");
} catch (error) {
  console.log("Failed to connect.");
  process.exit(1);
}

console.log(await views.getLivestock(pool));
console.log(await views.getMeatSelection(pool));
console.log(await views.getDeliveries(pool));
console.log(await views.getClients(pool));

console.log(await views.getNutrition(pool));
console.log(await views.getOrderLine(pool));
console.log(await views.getSupplier(pool));
console.log(await views.getAgreements(pool));


const result1 = await views.createSupplier(pool, {
    supplier_id: "BYM",
    company_name: "beatyomeat",
    contact_no: "0933-532-4345",
})
console.log("Deleted rows:", result1);
const result2 = await views.deleteSupplier(pool, "BYM");
console.log("Deleted rows:", result2);


/*
Rin version

// Load environment variables from .env file
dotenv.config();

// Create the connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
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
    ])) as unknown as [any[]];

    // Release the connection back to the pool
    connection.release();

    if (rows.length > 0) {
      console.log("Query result:", rows);
    } else {
      console.log("No user found.");
    }
  } catch (error) {
    console.error("Error connecting to database or running query:", error);
  } finally {
    // Close the pool when your application shuts down
    // (This is just an example; you wouldn't normally do this here)
    await pool.end();
  }
}

// Run the test query
testQuery();

*/
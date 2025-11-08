import mysql from "mysql2/promise";
import process from "process";

export let pool: mysql.Connection;

try {
    pool = await mysql.createConnection({
    host: "localhost",
    user: "root",        // your MySQL username
    password: "Dlsu1234!",// your MySQL password
    database: "carnivault", // your database name
    });
    
    console.log("Connected to MySQL database");
}
catch(error){
    console.log("Failed to connect.", error);
    process.exit(1);
}

const [rows] = await pool.query("SELECT * FROM livestock");
console.log(rows);
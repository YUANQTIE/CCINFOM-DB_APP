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
}
catch(error){
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

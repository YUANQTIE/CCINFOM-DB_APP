import mysql from "mysql2/promise";

export async function getLivestock(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM livestock");
    return records;    
}

export async function getMeatSelection(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM meat_selection");
    return records;  
}

export async function getDeliveries(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM deliveries");
    return records;  
}

export async function getClients(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM clients");
    return records;  
}
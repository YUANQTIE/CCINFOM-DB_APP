import { get } from "http";
import {pool} from "./db.ts"
import mysql from "mysql2/promise";
import * as obj from "./objects.ts";

// SUPPLIERS
export async function getSupplier() {
    const [records] = await pool.query("SELECT * FROM supplier");
    return records;
}

export async function getLivestockBySupplier(supplierName : string) {
    const [records] = await pool.query(`
        SELECT l.livestock_id, l.breed FROM supplier s
        JOIN livestock l ON s.supplier_id = l.supplier_id
        WHERE s.company_name = ?;
        `, [supplierName]
    );

    return records;
}

//LIVESTOCK
export async function getLivestock() {
    const [records] = await pool.query("SELECT * FROM livestock");
    return records;
}

export async function getMeatByLivestockBreed(breed : string) {
    const [records] = await pool.query(`
        SELECT m.serial_no, m.cut_type FROM livestock l
        JOIN meat_selection m ON l.livestock_id = m.origin_livestock_id
        WHERE l.breed = ?;
        `, [breed]
    );

    return records;
}

// MEAT SELECTION
export async function getMeatSelection() {
    const [records] = await pool.query("SELECT * FROM meat_selection");
    return records;
}

export async function getTotalStatusMeatCutInventory(status : string) {
    const [records] = await pool.query(`
        SELECT * FROM meat_selection
        WHERE status = ?
        `, [status]
    );

    const rows = records as any[]
    const count = rows.length;

    return count;
}

export async function getTotalStorageInventory(location : string) {
    const [records] = await pool.query(`
        SELECT * FROM meat_selection
        WHERE storage_location = ?
        `, [location]
    );

    const rows = records as any[]
    const count = rows.length;

    return count;
}

export async function getClientByCutType(cutType: string) {
    const [records] = await pool.query(`
        SELECT c.restaurant_name FROM clients c
        JOIN deliveries d ON c.restaurant_code = d.restaurant_code
        JOIN order_line ol ON d.delivery_no = ol.order_no
        JOIN meat_selection m ON ol.item_serial_no = m.serial_no
        WHERE m.cut_type = ?;
        `, [cutType]
    )    

    return records;
}

// NUTRITION
export async function getNutrition() {
    const [records] = await pool.query("SELECT * FROM nutrition");
    return records;
}

export async function getMeatWithNutrition() {
    const [records] = await pool.query(`
        SELECT * FROM meat_selection m
        JOIN nutrition n ON m.serial_no = n.item_serial_no;
        `
    );
    return records;
}

// CLIENTS
export async function getClients() {
    const [records] = await pool.query("SELECT * FROM clients");
    return records;
}

export async function getCutTypeByClient(restaurant_name : string) {
    const [records] = await pool.query(`
        SELECT DISTINCT m.cut_type FROM clients c
        JOIN deliveries d ON c.restaurant_code = d.restaurant_code
        JOIN order_line ol ON d.delivery_no = ol.order_no
        JOIN meat_selection m ON ol.item_serial_no = m.serial_no
        WHERE c.restaurant_name = ?;        
        `, [restaurant_name]
    );
    return records;
}

// AGREEMENTS
export async function getAgreements() {
    const [records] = await pool.query("SELECT * FROM agreements");
    return records;
}

export async function getClientWithAgreements() {
    const [records] = await pool.query(`
        SELECT * FROM clients c
        JOIN agreements a ON c.restaurant_code = a.restaurant_code
        `
    );
    return records;
}

// DELIVERIES
export async function getDeliveries() {
    const [records] = await pool.query("SELECT * FROM deliveries");
    return records;
}

export async function getRestaurantsByDriver(name : string) {
    const [records] = await pool.query(`
        SELECT c.restaurant_name FROM deliveries d
        JOIN clients c ON d.restaurant_code = c.restaurant_code
        WHERE driver_name = ?
        `, [name]
    );
    return records;
}

export async function getOrderLine() {
    const [records] = await pool.query("SELECT * FROM order_line");
    return records;
}

export async function getCutTypeInOrder(order_no : number) {
    const [records] = await pool.query(`
        SELECT m.cut_type FROM order_line ol 
        JOIN meat_selection m ON ol.item_serial_no = m.serial_no
        WHERE ol.order_no = ?
        `, [order_no]
    );
    return records;
}
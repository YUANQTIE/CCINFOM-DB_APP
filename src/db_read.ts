import { get } from "http";
import {pool} from "./db.ts"
import mysql from "mysql2/promise";
import * as obj from "./objects.ts";

export async function getSupplier() {
    const [records] = await pool.query("SELECT * FROM supplier");
    return records;
}

export async function getLivestock() {
    const [records] = await pool.query("SELECT * FROM livestock");
    return records;
}

export async function getMeatSelection() {
    const [records] = await pool.query("SELECT * FROM meat_selection");
    return records;
}

export async function getNutrition() {
    const [records] = await pool.query("SELECT * FROM nutrition");
    return records;
}

export async function getClients() {
    const [records] = await pool.query("SELECT * FROM clients");
    return records;
}

export async function getDeliveries() {
    const [records] = await pool.query("SELECT * FROM deliveries");
    return records;
}

export async function getOrderLine() {
    const [records] = await pool.query("SELECT * FROM order_line");
    return records;
}

export async function getAgreements() {
    const [records] = await pool.query("SELECT * FROM agreements");
    return records;
}


import {pool} from "./db.ts";
import mysql from "mysql2/promise";
import * as read from "./db_read.ts";
import * as obj from "./objects.ts";

export async function createSupplier(s: obj.Supplier) {
    const [result] = await pool.query(`
        INSERT INTO supplier (supplier_id, company_name, contact_no)
        VALUES (?, ?, ?)
        `, [
            s.supplier_id,
            s.company_name,
            s.contact_no]);
    return read.getSupplier();
}

export async function createLivestock(l : obj.Livestock) {
    const [records] = await pool.query(`
        INSERT INTO livestock (livestock_id, breed, age, weight, country_of_origin, medical_condition, vaccination_status, date_arrived, storage_location, supplier_id, status, processing_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            l.livestock_id,
            l.breed,
            l.age,
            l.weight,
            l.country_of_origin,
            l.medical_condition,
            l.vaccination_status,
            l.date_arrived,
            l.storage_location,
            l.supplier_id,
            l.status,
            l.processing_date]);
    return read.getLivestock();
}

export async function createMeatSelection(cut: obj.MeatSelection) {
    const [result] = await pool.query(`
        INSERT INTO meat_cuts (
        serial_no, cut_type, weight, expiry_date, storage_location,
        quality_control_clearance, status, origin_livestock_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        cut.serial_no,
        cut.cut_type,
        cut.weight,
        cut.expiry_date,
        cut.storage_location,
        cut.quality_control_clearance,
        cut.status,
        cut.origin_livestock_id
    ]);

    return read.getMeatSelection();
}

export async function createNutrition(n: obj.Nutrition) {
    const [result] = await pool.query(`
        INSERT INTO nutrition (
        item_serial_no, tenderness, color, fat_content, protein_content, connective_tissue_content, water_holding_content, pH, water_distribution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        n.item_serial_no,
        n.tenderness,
        n.color,
        n.fat_content,
        n.protein_content,
        n.connective_tissue_content,
        n.water_holding_content,
        n.pH,
        n.water_distribution
    ]);

    return read.getNutrition();
}

export async function createClient(c: obj.Client) {
    const [result] = await pool.query(`
        INSERT INTO clients (
        restaurant_code, client_name, restaurant_name, restaurant_type, restaurant_address, contact_no, email_address, year_of_establishment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        c.restaurant_code,
        c.client_name,
        c.restaurant_name,
        c.restaurant_type,
        c.restaurant_address,
        c.contact_no,
        c.email_address,
        c.year_of_establishment
    ]);

    return read.getClients();
}

export async function createDelivery(d: obj.Delivery) {
    const [result] = await pool.query(`
        INSERT INTO deliveries (delivery_no, driver_name, truck_number, distance_travelled, delivery_duration, weight, restaurant_code, status, profit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        d.delivery_no,
        d.driver_name,
        d.truck_number,
        d.distance_travelled,
        d.delivery_duration,
        d.weight,
        d.restaurant_code,
        d.status,
        d.profit
    ]);
    return read.getDeliveries();
}

export async function createOrderLine(o: obj.OrderLine) {
    const [result] = await pool.query(`
        INSERT INTO order_line (order_line_no, item_serial_no
        ) VALUES (?, ?)
    `, [
        o.order_line_no,
        o.item_serial_no
    ]);
    return read.getOrderLine();
}

export async function createAgreement(a: obj.Agreement) {
    const [result] = await pool.query(`
        INSERT INTO agreements (
        restaurant_code, client_pricing, week_of_delivery, cut_type_of_choice, tenderness, color, fat_content, protein_content, connective_tissue_content, water_holding_capacity, pH, water_distribution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        a.restaurant_code,
        a.client_pricing,
        a.week_of_delivery,
        a.cut_type_of_choice,
        a.tenderness,
        a.color,
        a.fat_content,
        a.protein_content,
        a.connective_tissue_content,
        a.water_holding_capacity,
        a.pH,
        a.water_distribution
    ]);
    return read.getAgreements();
}

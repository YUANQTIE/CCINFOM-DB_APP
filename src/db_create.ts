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

export async function createLivestock(l : obj.LivestockInput) {
    await pool.query(`
      INSERT INTO livestock(livestock_id, breed, weight, age, country_of_origin, medical_condition, vaccination_status, date_arrived, storage_location, supplier_id, status, processing_date)
      VALUES 
      (CONCAT(DATE_FORMAT(CURDATE(), '%y%m%d'), '-', (FLOOR(RAND() * (9999 - 1000 + 1)) + 1000)), 
      ?, 
      ?, 
      ?, 
      ?, 
      ?, 
      ?, 
      CURDATE(), 
      ?, 
      ?, 
      1, 
      NULL);
      `, [
          l.breed,
          l.weight,
          l.age,
          l.country_of_origin,
          l.medical_condition,
          l.vaccination_status,
          l.storage_location,
          l.supplier_id,]);
    return read.getLivestock();
}

export async function createMeatSelection(cut: obj.MeatSelection) {
    const [result] = await pool.query(`
        INSERT INTO meat_selection (
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
        item_serial_no, tenderness, color, fat_content, protein_content, connective_tissue_content, water_holding_capacity, pH, water_distribution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        n.item_serial_no,
        n.tenderness,
        n.color,
        n.fat_content,
        n.protein_content,
        n.connective_tissue_content,
        n.water_holding_capacity,
        n.pH,
        n.water_distribution
    ]);

    //return read.getNutrition();
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
}

// Create a new delivery
export async function createDelivery(d: { restaurant_code: string }) {
  const [result] = await pool.query(`
    INSERT INTO deliveries (order_date, restaurant_code, status)
    VALUES (NOW(), ?, "Pending")
  `, [d.restaurant_code]) as any;

  return result.insertId as number;
}

// Create an order line
export async function createOrderLine(o: { order_line_no: number, agreement_no: number }) {
  const [result] = await pool.query(`
    INSERT INTO order_line (order_no, agreement_no)
    VALUES (?, ?)
  `, [o.order_line_no, o.agreement_no]) as any;

  return result.insertId as number;
}

export async function createAgreement(a: obj.Agreement) {
  const [result] = await pool.query(`
    INSERT INTO agreements (
      restaurant_code, contract_start, contract_end, client_pricing, week_of_delivery, cut_type_of_choice,
      weight, tenderness, color, fat_content, protein_content, connective_tissue_content,
      water_holding_capacity, pH, water_distribution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    a.restaurant_code,
    a.contract_start,
    a.contract_end,
    a.client_pricing,
    a.week_of_delivery,
    a.cut_type_of_choice,
    a.weight || null,
    a.tenderness || null,
    a.color || null,
    a.fat_content || null,
    a.protein_content || null,
    a.connective_tissue_content || null,
    a.water_holding_capacity || null,
    a.pH || null,
    a.water_distribution || null
  ]);
}
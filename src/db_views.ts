import { get } from "http";
import mysql from "mysql2/promise";

export interface Supplier {
    supplier_id: string;
    company_name: string;
    contact_no: string;
}

export interface Livestock {
    livestock_id: string;
    breed: string;
    weight: number;
    age: number;
    country_of_origin: string;
    medical_condition: string;
    vaccination_status: "Vaccinated" | "Not Vaccinated" | "Pending";
    date_arrived: string;
    storage_location: string;
    supplier_id: string;
    status: "For Processing" | "Processed" | "Discarded";
    processing_date?: string | null;
}

export interface MeatSelection {
    serial_no: string;
    cut_type:  'Arm Chuck Roast' | 'Cross Rib Chuck Roast' | 'Prime Rib Roast' | 'Porterhouse Steak'
            | 'Top Sirloin Steak' | 'Top Round' | 'Kabobs' | 'Arm Chuck Steak' | 'Shoulder Roast'
            | 'Ribeye Steak, Bone-In' | 'T-Bone Steak' | 'Top Sirloin Petite Roast' | 'Top Round Steak'
            | 'Stew Meat' | 'Blade Chuck Roast' | 'Shoulder Steak' | 'Back Ribs'
            | 'Strip Steak, Bone-In' | 'Top Sirloin Filet' | 'Bottom Round Roast' | 'Strips'
            | 'Blade Chuck Steak' | 'Ranch Steak' | 'Ribeye Roast, Boneless' | 'Strip Steak, Boneless'
            | 'Coulotte Roast' | 'Bottom Round Rump Roast' | 'Cubed Steak' | '7-Bone Chuck Roast'
            | 'Flat Iron Steak' | 'Ribeye Steak, Boneless' | 'Strip Petite Roast' | 'Coulotte Steak'
            | 'Ground Beef and Ground Beef Patties' | 'Chuck Center Roast' | 'Top Blade Steak'
            | 'Ribeye Cap Steak' | 'Strip Filet' | 'Tri-Tip Roast' | 'Eye of Round Roast'
            | 'Shank Cross-Cut' | 'Denver Steak' | 'Shoulder Petite Tender' | 'Ribeye Petite Roast'
            | 'Tenderloin Roast' | 'Tri-Tip Steak' | 'Eye of Round Steak' | 'Tenderloin Tips'
            | 'Chuck Eye Roast' | 'Shoulder Petite Tender Medallions' | 'Ribeye Filet'
            | 'Tenderloin Steak (Filet Mignon)' | 'Petite Sirloin Steak' | 'Brisket Flat'
            | 'Inside Skirt' | 'Flank Steak' | 'Short Ribs, Bone-In' | 'Chuck Eye Steak'
            | 'Sirloin Bavette Steak' | 'Brisket Point' | 'Country-Style Ribs';
    weight: number;
    expiry_date: string;
    storage_location: string;
    quality_control_clearance: 'Pending' | 'Approved' | 'Rejected';
    status: 'Available' | 'Reserved' | 'Sold' | 'Discarded';
    origin_livestock_id: string;
}

export interface Nutrition {
    item_serial_no: string;
    tenderness:  'Very Tender' | 'Tender' | 'Moderate' | 'Tough';
    color:  'Bright Red' | 'Dark Red' | 'Pale' | 'Brownish';
    fat_content: number;
    protein_content: number;
    connective_tissue_content: number;
    water_holding_content: number;
    pH : number;
    water_distribution : number;
}

export interface Client {
    restaurant_code : string;
    client_name : string;
    restaurant_name : string;
    restaurant_type : string;
    restaurant_address : string;
    contact_no : string;
    email_address : string;
    year_of_establishment : number;
}

export interface Delivery {
    delivery_no : number;
    driver_name : string;
    truck_number : string;
    distance_travelled : number;
    delivery_duration : number;
    weight : number;
    restaurant_code : string;
    status : 'Pending' | 'Delivered' | 'Cancelled' | 'Returned';
    profit : number;
}   

export interface OrderLine {
    order_line_no : number;
    item_serial_no : string;
}

export interface Agreement {
    restaurant_code : string;
    client_pricing : number;
    week_of_delivery : number;
    cut_type_of_choice : MeatSelection['cut_type'];
    tenderness? : Nutrition['tenderness'];
    color? : Nutrition['color'];
    fat_content? : number;
    protein_content? : number;
    connective_tissue_content? : number;
    water_holding_capacity? : number;
    pH? : number;
    water_distribution? : number;
}

export async function getSupplier(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM supplier");
    return records;
}

export async function getLivestock(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM livestock");
    return records;
}

export async function getMeatSelection(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM meat_selection");
    return records;
}

export async function getNutrition(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM nutrition");
    return records;
}

export async function getClients(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM clients");
    return records;
}

export async function getDeliveries(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM deliveries");
    return records;
}

export async function getOrderLine(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM order_line");
    return records;
}

export async function getAgreements(pool: mysql.Connection) {
    const [records] = await pool.query("SELECT * FROM agreements");
    return records;
}

export async function createSupplier(pool: mysql.Connection, s: Supplier) {
    const [result] = await pool.query(`
        INSERT INTO supplier (supplier_id, company_name, contact_no)
        VALUES (?, ?, ?)
        `, [
            s.supplier_id,
            s.company_name,
            s.contact_no]);
    return getSupplier(pool);
}

export async function createLivestock(pool: mysql.Connection, l : Livestock) {
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
    return getLivestock(pool);
}

export async function createMeatSelection(pool: mysql.Connection, cut: MeatSelection) {
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

    return getMeatSelection(pool);
}

export async function createNutrition(pool: mysql.Connection, n: Nutrition) {
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

    return getNutrition(pool);
}

export async function createClient(pool: mysql.Connection, c: Client) {
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

    return getClients(pool);
}

export async function createDelivery(pool: mysql.Connection, d: Delivery) {
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
    return getDeliveries(pool);
}

export async function createOrderLine(pool: mysql.Connection, o: OrderLine) {
    const [result] = await pool.query(`
        INSERT INTO order_line (order_line_no, item_serial_no
        ) VALUES (?, ?)
    `, [
        o.order_line_no,
        o.item_serial_no
    ]);
    return getOrderLine(pool);
}

export async function createAgreement(pool: mysql.Connection, a: Agreement) {
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
    return getAgreements(pool);
}

export async function deleteSupplier(pool: mysql.Connection, supplier_id: string) {
    const [result] = await pool.execute(
        "DELETE FROM supplier WHERE supplier_id = ?",
        [supplier_id]
    );
    return getSupplier(pool);
}
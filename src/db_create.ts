// --- db_create.ts ---
import { pool } from "./db.ts";
import * as read from "./db_read.ts";
import * as update from "./db_update.ts";
import * as obj from "./objects.ts";

// --- SUPPLIER ---
export async function createSupplier(s: obj.SupplierInput) {
  let letters = s.company_name.substring(0, 3);
  letters = letters.toUpperCase();
  const numbers = (Math.floor(Math.random() * 900) + 100).toString();
  const key = letters + numbers;

  const [result] = await pool.query(
    `
    INSERT INTO supplier (supplier_id, company_name, contact_no)
    VALUES (
      ?, 
      ?, 
      ?
    )
    `,
    [key, s.company_name, s.contact_no]
  );
  return result;
}

// --- LIVESTOCK ---
export async function createLivestock(l: obj.LivestockInput) {
  await pool.query(
    `
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
      `,
    [
      l.breed,
      l.weight,
      l.age,
      l.country_of_origin,
      l.medical_condition,
      l.vaccination_status,
      l.storage_location,
      l.supplier_id,
    ]
  );
  return read.getLivestock();
}

export async function processLivestock(livestock_id: string) {
  let abrv: string[] = [
    "ACR",
    "CRC",
    "PRR",
    "PTS",
    "TSS",
    "TPR",
    "KAB",
    "ACS",
    "SRR",
    "RSB",
    "TBS",
    "TSP",
    "TRS",
    "STM",
    "BCR",
    "SHS",
    "BRB",
    "SSI",
    "TSF",
    "BRR",
    "STR",
    "BCS",
    "RAN",
    "RRB",
    "SSB",
    "CLR",
    "BRO",
    "CUB",
    "SBR",
    "FIR",
    "RSO",
    "SPR",
    "CLS",
    "GBP",
    "CCR",
    "TBT",
    "RCS",
    "STF",
    "TTR",
    "ERR",
    "SHX",
    "DES",
    "SPT",
    "RPR",
    "TLR",
    "TTS",
    "ERS",
    "TLT",
    "CER",
    "SPM",
    "RNF",
    "TSM",
    "PSS",
    "BRF",
    "ISK",
    "FLS",
    "SRB",
    "CES",
    "SBS",
    "BRP",
    "CSR",
  ];

  let cuts: string[] = [
    "Arm Chuck Roast",
    "Cross Rib Chuck Roast",
    "Prime Rib Roast",
    "Porterhouse Steak",
    "Top Sirloin Steak",
    "Top Round",
    "Kabobs",
    "Arm Chuck Steak",
    "Shoulder Roast",
    "Ribeye Steak, Bone-In",
    "T-Bone Steak",
    "Top Sirloin Petite Roast",
    "Top Round Steak",
    "Stew Meat",
    "Blade Chuck Roast",
    "Shoulder Steak",
    "Back Ribs",
    "Strip Steak, Bone-In",
    "Top Sirloin Filet",
    "Bottom Round Roast",
    "Strips",
    "Blade Chuck Steak",
    "Ranch Steak",
    "Ribeye Roast, Boneless",
    "Strip Steak, Boneless",
    "Coulotte Roast",
    "Bottom Round Rump Roast",
    "Cubed Steak",
    "7-Bone Chuck Roast",
    "Flat Iron Steak",
    "Ribeye Steak, Boneless",
    "Strip Petite Roast",
    "Coulotte Steak",
    "Ground Beef and Ground Beef Patties",
    "Chuck Center Roast",
    "Top Blade Steak",
    "Ribeye Cap Steak",
    "Strip Filet",
    "Tri-Tip Roast",
    "Eye of Round Roast",
    "Shank Cross-Cut",
    "Denver Steak",
    "Shoulder Petite Tender",
    "Ribeye Petite Roast",
    "Tenderloin Roast",
    "Tri-Tip Steak",
    "Eye of Round Steak",
    "Tenderloin Tips",
    "Chuck Eye Roast",
    "Shoulder Petite Tender Medallions",
    "Ribeye Filet",
    "Tenderloin Steak (Filet Mignon)",
    "Petite Sirloin Steak",
    "Brisket Flat",
    "Inside Skirt",
    "Flank Steak",
    "Short Ribs, Bone-In",
    "Chuck Eye Steak",
    "Sirloin Bavette Steak",
    "Brisket Point",
    "Country-Style Ribs",
  ];

  for (let i = 0; i < abrv.length; i++) {
    await pool.query(
      `
        INSERT INTO meat_selection (
        serial_no, 
        cut_type, 
        weight, 
        expiry_date, 
        storage_location,
        quality_control_clearance, 
        status, 
        origin_livestock_id
        ) VALUES (
         CONCAT(?, '-' , DATE_FORMAT(CURDATE(), '%y%m%d'), '-', (FLOOR(RAND() * (9999 - 1000 + 1)) + 1000)), 
         ?, 
         ROUND((RAND() * 7.0 + 0.5), 2), 
         DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 
         CONCAT('Cooler', ' ', FLOOR(RAND() * (10 - 1 + 1)) + 1), 
         1, 
         1, 
         ?
         )
        `,
      [abrv[i], cuts[i], livestock_id]
    );
  }

  await update.updateLivestockStatus(livestock_id);
}

// --- MEAT & NUTRITION ---
export async function createMeatSelection(cut: obj.MeatSelection) {
  const [result] = await pool.query(
    `
    INSERT INTO meat_selection (
      serial_no, cut_type, weight, expiry_date, storage_location,
      quality_control_clearance, status, origin_livestock_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      cut.serial_no,
      cut.cut_type,
      cut.weight,
      cut.expiry_date,
      cut.storage_location,
      cut.quality_control_clearance,
      cut.status,
      cut.origin_livestock_id,
    ]
  );
  return result;
}

export async function createNutrition(
  serial_no: string,
  n: obj.NutritionInput
) {
  const [result] = await pool.query(
    `
    INSERT INTO nutrition (
      item_serial_no, 
      tenderness, 
      color, 
      fat_content, 
      protein_content, 
      connective_tissue_content, 
      water_holding_capacity, 
      pH, 
      water_distribution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      serial_no,
      n.tenderness,
      n.color,
      n.fat_content,
      n.protein_content,
      n.connective_tissue_content,
      n.water_holding_capacity,
      n.pH,
      n.water_distribution,
      serial_no
    ]
  );

  await update.updateQualityControlClearance(serial_no)
  return result;
}

// --- CLIENTS & AGREEMENTS ---
export async function createClient(c: obj.Client) {
  const [result] = await pool.query(
    `
    INSERT INTO clients (
      restaurant_code, client_name, restaurant_name, restaurant_type, 
      restaurant_address, contact_no, email_address, year_of_establishment
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      c.restaurant_code,
      c.client_name,
      c.restaurant_name,
      c.restaurant_type,
      c.restaurant_address,
      c.contact_no,
      c.email_address,
      c.year_of_establishment,
    ]
  );
  return result;
}

export async function createAgreement(a: obj.Agreement) {
  const [result] = await pool.query(
    `
    INSERT INTO agreements (
      restaurant_code, contract_start, contract_end, client_pricing, 
      week_of_delivery, cut_type_of_choice, weight, tenderness, color, 
      fat_content, protein_content, connective_tissue_content,
      water_holding_capacity, pH, water_distribution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
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
      a.water_distribution || null,
    ]
  );
  return result;
}

// --- DELIVERIES & ORDERS ---

// Create a new delivery and return its ID
export async function createDelivery(d: { restaurant_code: string }) {
  const [result] = (await pool.query(
    `
    INSERT INTO deliveries (order_date, restaurant_code, status)
    VALUES (NOW(), ?, "Pending")
    `,
    [d.restaurant_code]
  )) as any;

  return result.insertId as number;
}

// Create an order line (link between delivery and agreement)
export async function createOrderLine(o: {
  order_no: number;
  agreement_no: number;
}) {
  const [result] = (await pool.query(
    `
    INSERT INTO order_line (order_no, agreement_no)
    VALUES (?, ?)
    `,
    [o.order_no, o.agreement_no] // Fixed: was o.order_line_no
  )) as any;

  return result.insertId as number;
}

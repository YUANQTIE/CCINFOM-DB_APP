// --- db_read.ts ---
import { pool } from "./db.ts";

// --- SUPPLIERS ---
export async function getSupplier() {
  const [records] = await pool.query(`
    SELECT * FROM supplier
    ORDER BY company_name;
  `);
  return records;
}

export async function getLivestockBySupplier(supplierName: string) {
  const [records] = await pool.query(
    `
    SELECT l.livestock_id, l.breed FROM supplier s
    JOIN livestock l ON s.supplier_id = l.supplier_id
    WHERE s.company_name = ?
    ORDER BY l.date_arrived DESC;
  `,
    [supplierName]
  );
  return records;
}

export async function getSupplierFiltered(filterBy: string, key: string) {
  const wildcard = `%${key}%`;

  const filterMap: Record<string, string> = {
    "Supplier ID": "supplier_id",
    "Company Name": "company_name",
    "Contact No.": "contact_no",
  };

  let query = "";
  let params: any[] = [];

  if (filterBy === "All") {
    query = `
      SELECT * FROM supplier
      WHERE supplier_id LIKE ?
      OR company_name LIKE ?
      OR contact_no LIKE ?
      ORDER BY company_name;
    `;
    params = Array(3).fill(wildcard);
  } else {
    const column = filterMap[filterBy];

    if (!column) {
      throw new Error(`Unknown filter: ${filterBy}`);
    }

    query = `
      SELECT * FROM supplier
      WHERE ${column} LIKE ?
      ORDER BY company_name;
    `;
    params = [wildcard];
  }

  const [records] = await pool.query(query, params);
  return records;
}

// --- LIVESTOCK ---
export async function getLivestock() {
  const [records] = await pool.query(`
    SELECT * FROM livestock
    ORDER BY storage_location, date_arrived DESC;
  `);
  return records;
}

export async function getLivestockFiltered(filterBy: string, key: string) {
  const wildcard = `%${key}%`;

  const filterMap: Record<string, string> = {
    "Livestock ID": "livestock_id",
    "Breed": "breed",
    "Weight": "weight",
    "Age": "age",
    "Country of Origin": "country_of_origin",
    "Medical Condition": "medical_condition",
    "Vaccination Status": "vaccination_status",
    "Date Arrived": "date_arrived",
    "Storage Location": "storage_location",
    "Supplier ID": "supplier_id",
    "Status": "status",
    "Processing Date": "processing_date",
  };

  let query = "";
  let params: any[] = [];

  if (filterBy === "All") {
    query = `
      SELECT * FROM livestock
      WHERE livestock_id LIKE ?
      OR breed LIKE ?
      OR weight LIKE ?
      OR age LIKE ?
      OR country_of_origin LIKE ?
      OR medical_condition LIKE ?
      OR vaccination_status LIKE ?
      OR date_arrived LIKE ?
      OR storage_location LIKE ?
      OR supplier_id LIKE ?
      OR status LIKE ?
      OR processing_date LIKE ?
      ORDER BY date_arrived DESC
    `;
    params = Array(12).fill(wildcard);
  } else {
    const column = filterMap[filterBy];

    if (!column) {
      throw new Error(`Unknown filter: ${filterBy}`);
    }

    query = `
      SELECT * FROM livestock
      WHERE ${column} LIKE ?
      ORDER BY date_arrived DESC
    `;
    params = [wildcard];
  }

  const [records] = await pool.query(query, params);
  return records;
}

export async function getMeatByLivestockBreed(breed: string) {
  const [records] = await pool.query(
    `
    SELECT m.serial_no, m.cut_type FROM livestock l
    JOIN meat_selection m ON l.livestock_id = m.origin_livestock_id
    WHERE l.breed = ?;
  `,
    [breed]
  );
  return records;
}

// --- MEAT SELECTION & NUTRITION ---
export async function getMeatSelection() {
  const [records] = await pool.query(`
    SELECT * FROM meat_selection
    ORDER BY status, expiry_date;
  `);
  return records;
}

export async function getMeatSelectionFiltered(filterBy: string, key: string) {
  const wildcard = `%${key}%`;

  const filterMap: Record<string, string> = {
    "Serial No.": "serial_no",
    "Cut Type": "cut_type",
    "Weight": "weight",
    "Expiry Date": "expiry_date",
    "Storage Location": "storage_location",
    "Quality Control Clearance": "quality_control_clearance",
    "Status": "status",
    "Origin Livestock ID": "origin_livestock_id",
  };

  let query = "";
  let params: any[] = [];

  if (filterBy === "All") {
    query = `
      SELECT * FROM meat_selection
      WHERE serial_no LIKE ?
      OR cut_type LIKE ?
      OR weight LIKE ?
      OR expiry_date LIKE ?
      OR storage_location LIKE ?
      OR quality_control_clearance LIKE ?
      OR status LIKE ?
      OR origin_livestock_id LIKE ?
      ORDER BY status, expiry_date;
    `;
    params = Array(8).fill(wildcard);
  } else {
    const column = filterMap[filterBy];

    if (!column) {
      throw new Error(`Unknown filter: ${filterBy}`);
    }

    query = `
      SELECT * FROM meat_selection
      WHERE ${column} LIKE ?
      ORDER BY status, expiry_date;
    `;
    params = [wildcard];
  }

  const [records] = await pool.query(query, params);
  return records;
}

export async function getMeatNutrition(serial_no: string) {
    const [records] = await pool.query(`
        SELECT * FROM meat_selection m
        LEFT JOIN nutrition n ON m.serial_no = n.item_serial_no
        WHERE m.serial_no = ?;
        `, [serial_no]
    );
    return records;
}

export async function getTotalStatusMeatCutInventory(status: string) {
  const [records] = (await pool.query(
    `
    SELECT COUNT(*) AS count FROM meat_selection
    WHERE status = ?;
  `,
    [status]
  )) as any[];
  return records[0].count;
}

export async function getTotalStorageInventory(location: string) {
  const [records] = (await pool.query(
    `
    SELECT COUNT(*) AS count FROM meat_selection
    WHERE storage_location = ?;
  `,
    [location]
  )) as any[];
  return records[0].count;
}

export async function getClientByCutType(cutType: string) {
  const [records] = await pool.query(
    `
    SELECT c.restaurant_name FROM clients c
    JOIN deliveries d ON c.restaurant_code = d.restaurant_code
    JOIN order_line ol ON d.delivery_no = ol.order_no
    JOIN meat_selection m ON ol.item_serial_no = m.serial_no
    WHERE m.cut_type = ?;
  `,
    [cutType]
  );
  return records;
}

// --- CLIENTS & AGREEMENTS ---
export async function getClients() {
  const [records] = await pool.query(`
    SELECT * FROM clients
    ORDER BY restaurant_name;
  `);
  return records;
}

export async function getClientsFiltered(filterBy: string, key: string) {
  const wildcard = `%${key}%`;

  const filterMap: Record<string, string> = {
    "Restaurant Code": "restaurant_code",
    "Client Name": "client_name",
    "Restaurant Name": "restaurant_name",
    "Restaurant Type": "restaurant_type",
    "Restaurant Address": "restaurant_address",
    "Contact No.": "contact_no",
    "Email Address": "email_address",
    "Year of Establishment": "year_of_establishment",
  };

  let query = "";
  let params: any[] = [];

  if (filterBy === "All") {
    query = `
      SELECT * FROM clients
      WHERE restaurant_code LIKE ?
      OR client_name LIKE ?
      OR restaurant_name LIKE ?
      OR restaurant_type LIKE ?
      OR restaurant_address LIKE ?
      OR contact_no LIKE ?
      OR email_address LIKE ?
      OR year_of_establishment LIKE ?
      ORDER BY restaurant_name;
    `;
    params = Array(8).fill(wildcard);
  } else {
    const column = filterMap[filterBy];

    if (!column) {
      throw new Error(`Unknown filter: ${filterBy}`);
    }

    query = `
      SELECT * FROM clients
      WHERE ${column} LIKE ?
      ORDER BY restaurant_name;
    `;
    params = [wildcard];
  }

  const [records] = await pool.query(query, params);
  return records;
}

export async function getCutTypeByClient(restaurant_name: string) {
  const [records] = await pool.query(
    `
    SELECT DISTINCT m.cut_type AS cuts FROM clients c
    JOIN deliveries d ON c.restaurant_code = d.restaurant_code
    JOIN order_line ol ON d.delivery_no = ol.order_no
    JOIN meat_selection m ON ol.item_serial_no = m.serial_no
    WHERE TRIM(c.restaurant_name) = ?
    ORDER BY m.cut_type;        
  `,
    [restaurant_name]
  );
  return records;
}

export async function getClientsAgreements(restaurant_code: string) {
  const [records] = await pool.query(`
    SELECT 
        c.restaurant_code, c.restaurant_name,
        a.contract_end, a.contract_start, a.client_pricing,
        a.week_of_delivery, a.cut_type_of_choice, a.weight,
        a.color, a.fat_content, a.protein_content,
        a.connective_tissue_content, a.water_holding_capacity,
        a.pH, a.water_distribution
    FROM clients c
    JOIN agreements a ON c.restaurant_code = a.restaurant_code
    WHERE c.restaurant_code = ?;
    `, [restaurant_code]
  );
  return records;
}

// --- DELIVERIES ---
export async function getDeliveries() {
  const [records] = await pool.query(`
    SELECT * FROM deliveries
    ORDER BY delivery_no DESC;
  `);
  return records;
}

export async function getDeliveriesFiltered(filterBy: string, key: string) {
  const wildcard = `%${key}%`;

  const filterMap: Record<string, string> = {
    "Delivery No.": "delivery_no",
    "Driver Name": "driver_name",
    "Truck Number": "truck_number",
    "Deliver Date": "deliver_date",
    "Order Date": "order_date",
    "Distance Traveled": "distance_traveled",
    "Delivery Duration": "delivery_duration",
    "Weight": "weight",
    "Restaurant Code": "restaurant_code",
    "Status": "status",
  };

  let query = "";
  let params: any[] = [];

  if (filterBy === "All") {
    query = `
      SELECT * FROM deliveries
      WHERE delivery_no LIKE ?
      OR driver_name LIKE ?
      OR truck_number LIKE ?
      OR deliver_date LIKE ?
      OR order_date LIKE ?
      OR distance_traveled LIKE ?
      OR delivery_duration LIKE ?
      OR weight LIKE ?
      OR restaurant_code LIKE ?
      OR status LIKE ?
      ORDER BY delivery_no DESC;
    `;
    params = Array(10).fill(wildcard);
  } else {
    const column = filterMap[filterBy];

    if (!column) {
      throw new Error(`Unknown filter: ${filterBy}`);
    }

    query = `
      SELECT * FROM deliveries
      WHERE ${column} LIKE ?
      ORDER BY delivery_no DESC;
    `;
    params = [wildcard];
  }

  const [records] = await pool.query(query, params);
  return records;
}

export async function getRestaurantsByDriver(name: string) {
  const [records] = await pool.query(
    `
    SELECT c.restaurant_name FROM deliveries d
    JOIN clients c ON d.restaurant_code = c.restaurant_code
    WHERE driver_name = ?
    ORDER BY c.restaurant_name;
  `,
    [name]
  );
  return records;
}

export async function getDeliveryItems(order_no: number) {
  const [records] = await pool.query(
    `
    SELECT 
        m.serial_no, 
        m.cut_type, 
        m.weight 
    FROM order_line ol 
    JOIN meat_selection m ON ol.item_serial_no = m.serial_no
    WHERE ol.order_no = ?
    ORDER BY m.weight;
  `,
    [order_no]
  );
  return records;
}

// --- REPORT: LIVESTOCK KEEPING ---
export async function getAverageConditionRatio(
  date_start: string,
  date_end: string
) {
  const [records] = await pool.query(
    `
    SELECT 
        SUM(CASE WHEN medical_condition = 'Healthy' THEN 1 ELSE 0 END) AS healthy_count,
        SUM(CASE WHEN medical_condition <> 'Healthy' THEN 1 ELSE 0 END) AS unhealthy_count,
        ROUND(
            SUM(CASE WHEN medical_condition = 'Healthy' THEN 1 ELSE 0 END) / 
            IFNULL(NULLIF(SUM(CASE WHEN medical_condition <> 'Healthy' THEN 1 ELSE 0 END), 0), 1),
        2) AS healthy_to_unhealthy_ratio
    FROM livestock
    WHERE date_arrived BETWEEN ? AND ?;
  `,
    [date_start, date_end]
  );
  return records;
}

export async function getTotalBreedSuppliedBySupplier(
  breed: string,
  company_name: string,
  date_start: string,
  date_end: string
) {
  const [records] = await pool.query(
    `
    SELECT COUNT(*) AS total_breed_supplied
    FROM livestock AS l
    JOIN supplier AS s ON l.supplier_id = s.supplier_id
    WHERE l.breed = ? 
    AND s.company_name = ? 
    AND l.date_arrived BETWEEN ? AND ?
  `,
    [breed, company_name, date_start, date_end]
  );
  return records;
}

// --- REPORT: INVENTORY UPKEEP ---
export async function getTotalProducedMeatSelection(
  date_start: string,
  date_end: string,
  meat_cut: string
) {
  const [records] = await pool.query(
    `
    SELECT COUNT(*) AS total_produced_meat
    FROM meat_selection as ms
    JOIN livestock as l ON l.livestock_id = ms.origin_livestock_id
    WHERE l.processing_date BETWEEN ? AND ? AND ms.cut_type = ?
  `,
    [date_start, date_end, meat_cut]
  );
  return records;
}

export async function getAverageNutritionalQuantity(
  date_start: string,
  date_end: string,
  meat_cut: string
) {
  const [records] = await pool.query(
    `
    SELECT 
        AVG(n.fat_content) AS average_fat_content,
        AVG(n.protein_content) AS average_protein_content,
        AVG(n.connective_tissue_content) AS average_connective_tissue_content,
        AVG(n.water_holding_capacity) AS average_water_holding_capacity,
        AVG(n.water_distribution) AS average_water_distribution,
        AVG(n.pH) AS average_pH,
        (
            SELECT n2.tenderness
            FROM nutrition n2
            JOIN meat_selection ms2 ON n2.item_serial_no = ms2.serial_no
            JOIN livestock l2 on l2.livestock_id = ms2.origin_livestock_id
            WHERE ms2.cut_type = ?
              AND l2.processing_date BETWEEN ? AND ?
            GROUP BY n2.tenderness
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS most_frequent_tenderness,
        (
            SELECT n3.color
            FROM nutrition n3
            JOIN meat_selection ms3 ON n3.item_serial_no = ms3.serial_no
            JOIN livestock l3 on l3.livestock_id = ms3.origin_livestock_id
            WHERE ms3.cut_type = ?
              AND l3.processing_date BETWEEN ? AND ?
            GROUP BY n3.color
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS most_frequent_color
    FROM meat_selection ms
    JOIN nutrition n ON ms.serial_no = n.item_serial_no
    JOIN livestock l on l.livestock_id = ms.origin_livestock_id
    WHERE ms.cut_type = ?
      AND l.processing_date BETWEEN ? AND ?;
    `,
    [
      meat_cut,
      date_start,
      date_end,
      meat_cut,
      date_start,
      date_end,
      meat_cut,
      date_start,
      date_end,
    ]
  );
  return records;
}

// --- REPORT: SALES ---
export async function getTotalProfitByClient(
  restaurant_name: string,
  date_start: string,
  date_end: string
) {
  const [records] = await pool.query(
    `
    SELECT SUM(a.client_pricing) AS total_profit
    FROM deliveries d
    JOIN order_line ol ON ol.order_no = d.delivery_no
    JOIN agreements a ON ol.agreement_no = a.agreement_no
    JOIN clients c ON c.restaurant_code = a.restaurant_code
    WHERE c.restaurant_name = ? AND d.delivery_no IS NOT NULL AND d.deliver_date BETWEEN ? AND ?
  `,
    [restaurant_name, date_start, date_end]
  );
  return records || 0;
}

export async function getTotalProfit(date_start: string, date_end: string) {
  const [records] = await pool.query(
    `
    SELECT SUM(a.client_pricing) AS total_profit
    FROM deliveries d
    JOIN order_line ol ON ol.order_no = d.delivery_no
    JOIN agreements a ON ol.agreement_no = a.agreement_no
    WHERE d.delivery_no IS NOT NULL AND d.deliver_date BETWEEN ? AND ?
  `,
    [date_start, date_end]
  );
  return records || 0;
}

// --- REPORT: LOGISTICS ---
export async function getTotalDeliveriesByTruck(
  truck_number: number,
  date_start: string,
  date_end: string
) {
  const [records] = await pool.query(
    `
    SELECT COUNT(*) AS total_deliveries
    FROM deliveries
    WHERE truck_number = ?
    AND deliver_date BETWEEN ? AND ?
  `,
    [truck_number, date_start, date_end]
  );
  return records || 0;
}

export async function getDistanceToDurationRatio(
  truck_number: number,
  date_start: string,
  date_end: string
) {
  const [records] = await pool.query(
    `
    SELECT SUM(distance_traveled) / NULLIF(SUM(delivery_duration),0) AS distance_to_duration_ratio
    FROM deliveries
    WHERE truck_number = ?
    AND deliver_date BETWEEN ? AND ?
  `,
    [truck_number, date_start, date_end]
  );
  return records || 0;
}

// --- CLIENT VIEW: INFO & AGREEMENTS ---
export async function getClient(email_address: string) {
  const [records] = await pool.query(
    `
    SELECT restaurant_name, restaurant_type, restaurant_address, contact_no, email_address, year_of_establishment
    FROM clients
    WHERE email_address = ?
  `,
    [email_address]
  );
  return records;
}

export async function getClientAgreements(email_address: string) {
  const [records] = await pool.query(
    `
    SELECT a.contract_end, a.contract_start, a.client_pricing, a.week_of_delivery, 
           a.cut_type_of_choice, a.tenderness, a.color, a.fat_content, 
           a.protein_content, a.connective_tissue_content, a.water_holding_capacity, 
           a.pH, a.water_distribution
    FROM agreements a
    JOIN clients c ON c.restaurant_code = a.restaurant_code
    WHERE c.email_address = ?
  `,
    [email_address]
  );
  return records;
}

export async function getClientAgreementsWithNumber(email_address: string) {
  const [records] = await pool.query<any[]>(
    `
    SELECT a.agreement_no, a.restaurant_code, a.contract_end, a.contract_start, 
           a.client_pricing, a.week_of_delivery, a.cut_type_of_choice, 
           a.tenderness, a.color, a.fat_content, a.protein_content, 
           a.connective_tissue_content, a.water_holding_capacity, a.pH, a.water_distribution
    FROM agreements a
    JOIN clients c ON c.restaurant_code = a.restaurant_code
    WHERE c.email_address = ?
  `,
    [email_address]
  );
  return records;
}

// --- CLIENT VIEW: TRANSACTIONS ---
export async function getClientTransactions(email_address: string) {
  const [records] = await pool.query(
    `
    SELECT 
        d.order_date,
        d.deliver_date,
        ms.cut_type AS cut_type_of_choice,
        n.tenderness,
        n.color,
        n.fat_content,
        n.protein_content,
        n.connective_tissue_content,
        n.water_holding_capacity,
        n.pH,
        n.water_distribution
    FROM deliveries d
    JOIN clients c ON c.restaurant_code = d.restaurant_code
    JOIN order_line ol ON ol.order_no = d.delivery_no
    JOIN meat_selection ms ON ms.serial_no = ol.item_serial_no
    JOIN nutrition n ON n.item_serial_no = ms.serial_no
    WHERE c.email_address = ?
    ORDER BY d.order_date DESC
  `,
    [email_address]
  );
  return records;
}

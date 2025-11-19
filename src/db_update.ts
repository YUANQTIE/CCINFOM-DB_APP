// --- db_update.ts ---
import { pool } from "./db.ts";


// --- UPDATE MEAT ---
export async function updateMeatSelectionStorage(
  serial_no: string,
  storage_location: string
) {
  await pool.query(
    `
    UPDATE meat_selection
    SET storage_location = ?
    WHERE serial_no = ?;
  `,
    [storage_location, serial_no]
  );
}

// --- UPDATE LIVESTOCK ---
export async function updateLivestockMedCondition(
  livestock_id: string,
  medical_condition: string
) {
  await pool.query(
    `
    UPDATE livestock
    SET medical_condition = ?
    WHERE livestock_id = ?;
  `,
    [medical_condition, livestock_id]
  );
}

export async function updateLivestockVacStatus(
  livestock_id: string,
  vaccination_status: string
) {
  await pool.query(
    `
    UPDATE livestock
    SET vaccination_status = ?
    WHERE livestock_id = ?;
  `,
    [vaccination_status, livestock_id]
  );
}

// --- PROCESS MEAT ---
export async function updateLivestockStatus(livestock_id: string) {
  await pool.query(
    `
    UPDATE livestock
    SET status = 'Processed',
        processing_date = CURDATE()
    WHERE livestock_id = ?;
  `,
    [livestock_id]
  );
}

export async function updateQualityControlClearance(serial_no: string) {
  await pool.query(
    `
    UPDATE meat_selection
    SET quality_control_clearance = 'Approved'
    WHERE serial_no = ?;
  `,
    [serial_no]
  );
}

// --- DELIVER PRODUCT ---
export async function updateMeatSelectionReservedStatus(serial_no: string) {
  await pool.query(
    `UPDATE meat_selection
     SET status = 'Reserved'
     WHERE serial_no = ?`,
    [serial_no]
  );
}

export async function updateOrderLineReservedStatus(order_line_id: number, serial_no: string) {
  await pool.query(
    `UPDATE order_line
     SET item_serial_no = ?
     WHERE id = ?`,
    [serial_no, order_line_id]
  );
}

export async function updateDeliveryDate(
  deliveryNo: number,
) {
  await pool.query(`
    UPDATE deliveries
    SET deliver_date = CURDATE()
    WHERE delivery_no = ?;
    `, [deliveryNo]
  );
}

export async function updatePendingDeliveryInfo(
  delivery_no: string,
  driverName: string,
  truckNumber: number
) {
  await pool.query(
    `
    UPDATE deliveries
    SET 
        driver_name = ?,
        truck_number = ?
    WHERE delivery_no = ?;
  `, // Fixed: Added comma between driver_name = ? AND truck_number = ?
    [driverName, truckNumber, delivery_no]
  );
}

export async function updateSoldMeatSelection(deliveryNo: number) {
  await pool.query(`
    UPDATE meat_selection ms
    JOIN order_line ol ON ms.serial_no = ol.item_serial_no
    SET ms.status = 'Sold'
    WHERE ol.order_no = ?;
  `, [deliveryNo]);
}

export async function updateDeliveryDistance(deliveryNo: number, distanceTraveled: number) {
  await pool.query(`
    UPDATE deliveries
    SET distance_traveled = ?
    WHERE delivery_no = ?;
  `, [distanceTraveled, deliveryNo]);
}

export async function updateDeliveryDuration(deliveryNo: number, deliveryDuration: number) {
  await pool.query(`
    UPDATE deliveries
    SET delivery_duration = ?
    WHERE delivery_no = ?;
  `, [deliveryDuration, deliveryNo]);
}

export async function updateDeliveredDelivery(deliveryNo: number, status: string) {
  await pool.query(`
    UPDATE deliveries
    SET status = ?
    WHERE delivery_no = ?;
  `, [status, deliveryNo]);
}

export async function updatePendingDeliveryStatus(
  deliveryNo: number,
  distanceTraveled: number,
  deliveryDuration: number,
  status: string
) {
  await pool.query(
    `
    UPDATE deliveries
    SET 
        distance_traveled = ?,
        delivery_duration = ?,
        status = ?
    WHERE delivery_no = ?;
  `,
    [distanceTraveled, deliveryDuration, status, deliveryNo]
  );
}

export async function updateCancelledDeliveryStatus(deliveryNo: number) {
  await pool.query(
    `
    UPDATE deliveries
    SET 
        status = 'Cancelled'
    WHERE delivery_no = ?;
  `,
    [deliveryNo]
  );
}

export async function updateCancelledMeatSelectionStatus(serial_no: string) {
  await pool.query(
    `
    UPDATE meat_selection
    SET status = "Discarded"
    WHERE serial_no = ?;
  `,
    [serial_no]
  );
}


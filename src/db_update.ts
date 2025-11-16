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
export async function updateMeatSelectionStatus(
  serial_no: string,
  status: string
) {
  await pool.query(
    `
    UPDATE meat_selection
    SET status = ?
    WHERE serial_no = ?;
  `,
    [status, serial_no]
  );
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

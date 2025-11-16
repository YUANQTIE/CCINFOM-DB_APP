// --- db_delete.ts ---
import { pool } from "./db.ts";

export async function deleteSupplier(supplier_id: string) {
  const [result] = await pool.execute(
    "DELETE FROM supplier WHERE supplier_id = ?",
    [supplier_id]
  );
  // Return the result (e.g., affectedRows) instead of the whole list
  return result;
}

export async function deleteOrderLine(id : number){
  const [result] = await pool.execute(
    'DELETE FROM order_line WHERE id = ?',
    [id]
  );
}

export async function cancelOrderLine(order_line_id: number) {
  console.log("CANCEL ORDER LINE:", order_line_id);

  // 1. Get order line info
  const [rows] = await pool.query<any[]>(
    `
    SELECT item_serial_no, order_no
    FROM order_line
    WHERE id = ?;
    `,
    [order_line_id]
  );

  if (!rows.length) {
    return { error: "Order line not found" };
  }

  const serial_no = rows[0].item_serial_no;
  const delivery_no = rows[0].order_no;

  console.log("serial_no =", serial_no);
  console.log("delivery_no =", delivery_no);

  // 2. If supplied, discard meat
  if (serial_no !== null) {
    console.log("Discarding meat:", serial_no);

    await pool.query(
      `UPDATE meat_selection SET status = "Discarded" WHERE serial_no = ?`,
      [serial_no]
    );
  }

  // 3. Delete the order_line record itself
  console.log("Deleting order_line:", order_line_id);
  await pool.query(
    `DELETE FROM order_line WHERE id = ?`,
    [order_line_id]
  );

  // 4. Check how many order lines remain (needed count)
  const [needed] = await pool.query<any[]>(
    `
    SELECT COUNT(*) AS needed_orders
    FROM order_line
    WHERE order_no = ?;
    `,
    [delivery_no]
  );

  const neededCount = needed[0]?.needed_orders || 0;
  console.log("neededCount =", neededCount);

  // 5. Cancel delivery if no more order lines remain
  if (neededCount === 0) {
    console.log("Cancelling delivery:", delivery_no);
    await pool.query(
      `UPDATE deliveries SET status = "Cancelled" WHERE delivery_no = ?`,
      [delivery_no]
    );
  }

  return { success: true };
}

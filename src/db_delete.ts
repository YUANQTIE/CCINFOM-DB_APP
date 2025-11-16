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

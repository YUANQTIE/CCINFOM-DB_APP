import { get } from "http";
import {pool} from "./db.ts"
import mysql from "mysql2/promise";
import * as read from "./db_read.ts";
import * as obj from "./objects.ts";

export async function deleteSupplier(supplier_id: string) {
    const [result] = await pool.execute(
        "DELETE FROM supplier WHERE supplier_id = ?",
        [supplier_id]
    );
    return read.getSupplier();
}
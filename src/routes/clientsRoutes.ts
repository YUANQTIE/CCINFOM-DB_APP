import { Router } from "express";
import * as read from "../db_read.ts";
import * as create from "../db_create.ts";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await read.getClients();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/filter", async (req, res) => {
  const column = req.query.column as string;
  const search = req.query.search as string;

  try {
    const results = await read.getClientsFiltered(column, search);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/cut-type-by-client/:client", async (req, res) => {
  const { client } = req.params;
  try {
    const data = await read.getCutTypeByClient(client);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/agreement/:restaurantCode", async (req, res) => {
  const { restaurantCode } = req.params;
  try {
    const data = await read.getClientsAgreements(restaurantCode);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const data = req.body;
    const result = await create.createClientCompany(data);
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/add-agreement/:restaurantCode", async (req, res) => {
  const serial_no = req.params.restaurantCode;
  const data = req.body;

  try {
    await create.createClientAgreement(serial_no, data);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;

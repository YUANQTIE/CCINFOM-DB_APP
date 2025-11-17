import { Router } from "express";
import * as read from "../db_read.ts";

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

export default router;

import { Router } from "express";
import * as read from "../db_read.ts";
import * as update from "../db_update.ts";
import * as create from "../db_create.ts";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await read.getLivestock();
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
    const results = await read.getLivestockFiltered(column, search);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/meat-by-livestock-breed/:breed", async (req, res) => {
  const { breed } = req.params;
  try {
    const data = await read.getMeatByLivestockBreed(breed);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.put("/:livestock_id/condition", async (req, res) => {
  const livestock_id = req.params.livestock_id;
  const { condition } = req.body;

  try {
    await update.updateLivestockMedCondition(livestock_id, condition);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.put("/:livestock_id/vaccination", async (req, res) => {
  const livestock_id = req.params.livestock_id;
  const { vaccination_status } = req.body;

  try {
    await update.updateLivestockVacStatus(livestock_id, vaccination_status);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/supplier", async (req, res) => {
  try {
    const data = await read.getSupplier();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/suppliers/filter", async (req, res) => {
  const column = req.query.column as string;
  const search = req.query.search as string;

  try {
    const results = await read.getSupplierFiltered(column, search);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.post("/suppliers/add", async (req, res) => {
  try {
    const supplier = req.body;
    const result = await create.createSupplier(supplier);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add supplier" });
  }
});

router.get("/livestock-by-supplier/:supplier", async (req, res) => {
  const { supplier } = req.params;

  try {
    const data = await read.getLivestockBySupplier(supplier);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const livestock = req.body;
    const result = await create.createLivestock(livestock);
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/process/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await create.processLivestock(id);
    res.json({ success: true, message: "Livestock processed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;

import { Router } from "express";
import * as read from "../db_read.ts";
import * as update from "../db_update.ts";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const data = await read.getMeatSelection();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.get("/:serialNo", async (req, res) => {
    const {serialNo} = req.params
    try {
        const data = await read.getMeatNutrition(serialNo);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.put("/:serial_no/location", async (req, res) => {
  const serial_no = req.params.serial_no;
  const { storage_location } = req.body;

  try {
    await update.updateMeatSelectionStorage(serial_no, storage_location)
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.put("/:serial_no/location", async (req, res) => {
  const serial_no = req.params.serial_no;
  const { storage_location } = req.body;

  try {
    await update.updateMeatSelectionStorage(serial_no, storage_location)
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.put("/:serial_no/status", async (req, res) => {
  const serial_no = req.params.serial_no;
  const { status } = req.body;

  try {
    await update.updateMeatSelectionStatus(serial_no, status)
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/client-by-cut-type/:cutType", async (req, res) => {
    const {cutType} = req.params;
    try {
        const data = await read.getClientByCutType(cutType);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch clients by cut type" });
    }
});

export default router;

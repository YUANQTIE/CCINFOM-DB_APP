import { Router } from "express";
import * as read from "../db_read.ts";

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

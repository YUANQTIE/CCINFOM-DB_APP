import { Router } from "express";
import * as read from "../db_read.ts";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const data = await read.getLivestock();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch meat selection" });
    }
});

router.get("/meat-by-livestock-breed/:breed", async (req, res) => {
    const {breed} = req.params;
    try {
        const data = await read.getMeatByLivestockBreed(breed);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch clients by cut type" });
    }
});

router.get("/supplier", async (req, res) => {
    try {
        const data = await read.getSupplier();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch meat selection" });
    }
});

router.get("/livestock-by-supplier/:supplier", async (req, res) => {
    const {supplier} = req.params;

    try {
        const data = await read.getLivestockBySupplier(supplier);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch meat selection" });
    }
});

export default router;

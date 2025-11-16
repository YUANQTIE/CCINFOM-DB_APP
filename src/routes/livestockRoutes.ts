import { Router } from "express";
import * as read from "../db_read.ts";
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
    const filterBy = req.query.filterBy as string;
    const key = req.query.key as string;
    
    try {
        const results = await read.getLivestockFiltered(filterBy, key);
        res.json({ success: true, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.get("/meat-by-livestock-breed/:breed", async (req, res) => {
    const {breed} = req.params;
    try {
        const data = await read.getMeatByLivestockBreed(breed);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
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

router.get("/supplier/filter", async (req, res) => {
    const filterBy = req.query.filterBy as string;
    const key = req.query.key as string;
    
    try {
        const results = await read.getSupplierFiltered(filterBy, key);
        res.json({ success: true, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.post("/supplier/add", async (req, res) => {
    try {
        const supplier = req.body;
        const result = await create.createSupplier(supplier);
        res.json({ success: true, result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register" });
    }
});

router.get("/livestock-by-supplier/:supplier", async (req, res) => {
    const {supplier} = req.params;

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

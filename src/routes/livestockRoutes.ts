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

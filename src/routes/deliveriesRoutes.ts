import { Router } from "express";
import * as read from "../db_read.ts";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const data = await read.getDeliveries();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch meat selection" });
    }
});

router.get("/delivery-items/:no", async (req, res) => {
    const {no} = req.params;
    try {
        const number = Number(no)
        const data = await read.getDeliveryItems(number);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch deliveries by cut type" });
    }
});

router.get("/restaurant-by-driver/:driver", async (req, res) => {
    const {driver} = req.params;
    try {
        const data = await read.getRestaurantsByDriver(driver);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch deliveries by cut type" });
    }
});

export default router;
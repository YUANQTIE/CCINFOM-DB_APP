import { Router } from "express";
import * as read from "../db_read.ts";
import * as update from "../db_update.ts";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const data = await read.getDeliveries();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
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
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.get("/restaurant-by-driver/:driver", async (req, res) => {
    const {driver} = req.params;
    try {
        const data = await read.getRestaurantsByDriver(driver);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.put("/:delivery_no/driver", async (req, res) => {
    try {
        const delivery_no = Number(req.params.delivery_no)
        const { driver } = req.body;
        await update.updateDeliveryDriver(delivery_no, driver)
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.put("/:delivery_no/truck_no", async (req, res) => {
    try {
        const delivery_no = Number(req.params.delivery_no)
        const { truck_no } = req.body;
        await update.updateDeliveryTruckNo(delivery_no, truck_no)
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.put("/:delivery_no/date", async (req, res) => {
    try {
        const delivery_no = Number(req.params.delivery_no)
        await update.updateDeliveryDate(delivery_no)
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.put("/:delivery_no/distance", async (req, res) => {
    try {
        const delivery_no = Number(req.params.delivery_no)
        const { distance } = req.body;
        await update.updateDeliveryDistance(delivery_no, distance)
        res.json({ success: true });
  } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
  }
});

router.put("/:delivery_no/duration", async (req, res) => {
    try {
        const delivery_no = Number(req.params.delivery_no)
        const { duration } = req.body;
        await update.updateDeliveryDuration(delivery_no, duration)
        res.json({ success: true });
  } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
  }
});

router.put("/:delivery_no/status", async (req, res) => {
    try {
        const delivery_no = Number(req.params.delivery_no)
        const { status } = req.body;
        await update.updateDeliveryStatus(delivery_no, status)
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

export default router;
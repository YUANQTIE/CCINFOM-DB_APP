import { Router } from "express";
import * as read from "../db_read.ts";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const data = await read.getClients();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch meat selection" });
    }
});

router.get("/cut-type-by-client/:client", async (req, res) => {
    const {client} = req.params;
    try {
        const data = await read.getCutTypeByClient(client);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch clients by cut type" });
    }
});

export default router;
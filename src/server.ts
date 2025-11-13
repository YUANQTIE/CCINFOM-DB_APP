import express from "express";
import path from "path";
import cors from "cors";
import * as read from "./db_read.ts";
import meatSelectionRoutes from "./routes/meatSelectionRoutes.ts";
import livestockRoutes from "./routes/livestockRoutes.ts"
import clientsRoutes from "./routes/clientsRoutes.ts"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())
app.use(express.static("public"));

app.use("/api/meat-selection", meatSelectionRoutes);
app.use("/api/livestock", livestockRoutes);
app.use("/api/clients", clientsRoutes);

app.get("/api/cut-types-by-clients", async (req, res) => {
  try {
    const restaurant_name = req.query.restaurant_name as string;

    if (!restaurant_name) {
      return res.status(400).json({ error: "restaurant_name is required" });
    }

    const data = await read.getCutTypeByClient(restaurant_name);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meat cut types" });
  }
});

// GENERATE REPORTS

// LIVESTOCK KEEPING REPORT

app.get("/api/average-condition-ratio", async (req, res) => {
  try {
    const { start, end } = req.query as { start: string; end: string };
    if (!start || !end) return res.status(400).json({ error: "start and end are required" });

    const data = await read.getAverageConditionRatio(start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average condition ratio" });
  }
});

app.get("/api/total-breed-supplied", async (req, res) => {
  try {
    const { breed, company, start, end } = req.query as any;
    if (!breed || !company || !start || !end) 
      return res.status(400).json({ error: "breed, company, start, end are required" });

    const data = await read.getTotalBreedSuppliedBySupplier(breed, company, start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total breed supplied" });
  }
});

// INVETORY UPKEEP REPORT

app.get("/api/total-produced-meat", async (req, res) => {
  try {
    const { cut, start, end } = req.query as any;
    if (!cut || !start || !end) return res.status(400).json({ error: "cut, start, end required" });

    const data = await read.getTotalProducedMeatSelection(start, end, cut);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total produced meat" });
  }
});

app.get("/api/average-nutrition", async (req, res) => {
  try {
    const { cut, start, end } = req.query as any;
    if (!cut || !start || !end) return res.status(400).json({ error: "cut, start, end required" });

    const data = await read.getAverageNutritionalQuantity(start, end, cut);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average nutrition" });
  }
});

// SALES REPORT

app.get("/api/profit/client", async (req, res) => {
  try {
    const { client, start, end } = req.query as any;
    if (!client || !start || !end) return res.status(400).json({ error: "client, start, end required" });

    const data = await read.getTotalProfitByClient(client, start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total profit by client" });
  }
});

app.get("/api/profit/total", async (req, res) => {
  try {
    const { start, end } = req.query as any;
    if (!start || !end) return res.status(400).json({ error: "start and end required" });

    const data = await read.getTotalProfit(start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total profit" });
  }
});

// LOGISTICS REPORT

app.get("/api/deliveries/truck", async (req, res) => {
  try {
    const { truck, start, end } = req.query as any;
    if (!truck || !start || !end) return res.status(400).json({ error: "truck, start, end required" });

    const data = await read.getTotalDeliveriesByTruck(Number(truck), start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total deliveries by truck" });
  }
});

app.get("/api/deliveries/distance-duration", async (req, res) => {
  try {
    const { truck, start, end } = req.query as any;
    if (!truck || !start || !end) return res.status(400).json({ error: "truck, start, end required" });

    const data = await read.getDistanceToDurationRatio(Number(truck), start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch distance-to-duration ratio" });
  }
});

// FOR CLIENT VIEW

// MAKE AN ORDER

// note; use the same api key on table of transactions

// CANCEL AN ORDER

// CLIENT INFO

app.get("/api/client", async (req, res) => {
  try {
    const email_address = req.query.email_address as string;

    if (!email_address) {
      return res.status(400).json({ error: "email_address is required" });
    }

    const data = await read.getClient(email_address);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch client data" });
  }
});

app.get("/api/client/agreements", async (req, res) => {
  try {
    const email_address = req.query.email_address as string;

    if (!email_address) {
      return res.status(400).json({ error: "email_address is required" });
    }

    const data = await read.getClientAgreements(email_address);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch client agreements" });
  }
});

// MAKE NEW AGREEMENT

// TABLE OF TRANSACTIONS

app.get("/api/client-transactions", async (req, res) => {
  try {
    const email_address = req.query.email_address as string;

    if (!email_address) {
      return res.status(400).json({ error: "email_address is required" });
    }

    const data = await read.getClientTransactions(email_address);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch client transactions" });
  }
});

/*
app.use(express.static(
    path.join(__dirname), 
    {extensions: ["html"],})
);
app.use(express.static(path.join(__dirname, "../resources")));
*/

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log("You can now open:");
    console.log(`  - http://localhost:${port}`);
});

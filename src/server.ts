import express from "express";
import path from "path";
import cors from "cors";
import { pool } from "./db.ts"
import * as read from "./db_read.ts";
import meatSelectionRoutes from "./routes/meatSelectionRoutes.ts";
import livestockRoutes from "./routes/livestockRoutes.ts"
import clientsRoutes from "./routes/clientsRoutes.ts"
import deliveriesRoutes from "./routes/deliveriesRoutes.ts"
import * as create from "./db_create.ts";
import * as objects from "./objects.ts";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())
app.use(express.static("public"));

app.use("/api/meat-selection", meatSelectionRoutes);
app.use("/api/livestock", livestockRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/deliveries", deliveriesRoutes);

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

// API to get agreements
// Get client agreements with agreement_no
app.get("/api/client/agreements/number", async (req, res) => { 
  try { 
    const email_address = req.query.email_address as string; 
    if (!email_address) { 
      return res.status(400).json({ error: "email_address is required" }); 
    } 

    const data = await read.getClientAgreementsWithNumber(email_address); 
    res.json(data); 
  } catch (err) { 
    console.error("Error fetching client agreements:", err); 
    res.status(500).json({ error: "Failed to fetch client agreements" }); 
  } 
});

// Place order for selected agreements
app.post("/api/client/order", async (req, res) => { 
  try { 
    // Expecting: email_address + array of agreement_no 
    const { email_address, agreements } = req.body as { email_address: string; agreements: number[] }; 

    if (!email_address || !agreements || agreements.length === 0) { 
      return res.status(400).json({ error: "Email and agreements are required" }); 
    }

    // Fetch restaurant_code from email 
    const [clientRows] = await pool.query(
      `SELECT restaurant_code FROM clients WHERE email_address = ?`,
      [email_address]
    ) as any[]; 

    if (!clientRows || clientRows.length === 0) { 
      return res.status(404).json({ error: "Client not found" }); 
    } 

    const restaurant_code = clientRows[0].restaurant_code; 

    // Create delivery 
    const delivery_id = await create.createDelivery({ restaurant_code } as objects.Delivery); 

    // Create order lines for each selected agreement 
    for (const agreement_no of agreements) { 
      await create.createOrderLine({ order_line_no: delivery_id, agreement_no } as objects.OrderLine); 
    } 

    res.json({ message: "Order placed successfully", delivery_id }); 

  } catch (err) { 
    console.error("Error placing order:", err); 
    res.status(500).json({ error: "Failed to place order" }); 
  } 
});

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
    console.error("Error fetching client info:", err);
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
    console.error("Error fetching client agreements:", err);
    res.status(500).json({ error: "Failed to fetch client agreements" });
  }
});




// MAKE NEW AGREEMENT

app.post("/api/client/agreements/create", async (req, res) => {
  try {
    const a: objects.Agreement & { email_address: string } = req.body;

    // Required fields check
    const email = a.email_address?.trim();
    const start = a.contract_start?.trim();
    const end = a.contract_end?.trim();
    const pricing = Number(a.client_pricing);

    if (!email || !start || !end || isNaN(pricing)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    a.client_pricing = pricing;

    // Fetch restaurant_code from email
    const [rows] = await pool.query(`SELECT restaurant_code FROM clients WHERE email_address = ?`, [email]) as any[];
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Client not found" });

    a.restaurant_code = rows[0].restaurant_code;

    // Optional numeric fields
    a.weight = Number(a.weight);
    a.fat_content = a.fat_content ? Number(a.fat_content) : null;
    a.protein_content = a.protein_content ? Number(a.protein_content) : null;
    a.connective_tissue_content = a.connective_tissue_content ? Number(a.connective_tissue_content) : null;
    a.water_holding_capacity = a.water_holding_capacity ? Number(a.water_holding_capacity) : null;
    a.pH = a.pH ? Number(a.pH) : null;
    a.water_distribution = a.water_distribution ? Number(a.water_distribution) : null;

    await create.createAgreement(a);

    res.json({ message: "Agreement created successfully" });
  } catch (err) {
    console.error("Error creating agreement:", err);
    res.status(500).json({ error: "Failed to create agreement" });
  }
});


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

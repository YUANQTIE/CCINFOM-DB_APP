// --- server.ts ---
import express from "express";
import path from "path";
import cors from "cors";
import ejsLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";
import { pool } from "./db.ts";
import * as read from "./db_read.ts";
import * as create from "./db_create.ts";
import * as objects from "./objects.ts";

// Route Imports
import meatSelectionRoutes from "./routes/meatSelectionRoutes.ts";
import livestockRoutes from "./routes/livestockRoutes.ts";
import clientsRoutes from "./routes/clientsRoutes.ts";
import deliveriesRoutes from "./routes/deliveriesRoutes.ts";

// --- SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Body parser for JSON
app.use(ejsLayouts);

// --- STATIC ASSETS ---
app.use(express.static(path.join(__dirname, "..", "public")));

// --- VIEW ENGINE (EJS) ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

// --- API ROUTES (Imported) ---
app.use("/api/meat-selection", meatSelectionRoutes);
app.use("/api/livestock", livestockRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/deliveries", deliveriesRoutes);

// --- VIEW ROUTES (EJS) ---
app.get("", (req, res) => {
  res.render("index");
});

app.get("/inventory", (req, res) => {
  res.render("tables/inventory");
});

app.get("/livestock", (req, res) => {
  res.render("tables/livestock");
});

app.get("/deliveries", (req, res) => {
  res.render("tables/deliveries");
});

app.get("/clients", (req, res) => {
  res.render("tables/clients");
});

app.get("/process-meat", (req, res) => {
  res.render("process-meat");
});

app.get("/livestock/register", (req, res) => {
  res.render("register-new-livestock");
});

app.get("/livestock/suppliers", (req, res) => {
  res.render("suppliers");
});

app.get("/deliver-products", (req, res) => {
  res.render("deliver-products");
});

app.get("/settings", (req, res) => {
  res.render("settings");
});

// --- REPORT VIEW ROUTES ---
app.get("/reports/inventory-keeping", (req, res) => {
  res.render("reports/inventory-keeping");
});

app.get("/reports/livestock-keeping", (req, res) => {
  res.render("reports/livestock-keeping");
});

app.get("/reports/logistics-report", (req, res) => {
  res.render("reports/logistics-report");
});

app.get("/reports/sales-report", (req, res) => {
  res.render("reports/sales-report");
});

// --- API ROUTES (Reports) ---

// Livestock Keeping Report
app.get("/api/average-condition-ratio", async (req, res) => {
  try {
    const { start, end } = req.query as { start: string; end: string };
    if (!start || !end) {
      return res.status(400).json({ error: "start and end are required" });
    }
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
    if (!breed || !company || !start || !end) {
      return res
        .status(400)
        .json({ error: "breed, company, start, end are required" });
    }
    const data = await read.getTotalBreedSuppliedBySupplier(
      breed,
      company,
      start,
      end
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total breed supplied" });
  }
});

// Inventory Upkeep Report
app.get("/api/total-produced-meat", async (req, res) => {
  try {
    const { cut, start, end } = req.query as any;
    if (!cut || !start || !end) {
      return res.status(400).json({ error: "cut, start, end required" });
    }
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
    if (!cut || !start || !end) {
      return res.status(400).json({ error: "cut, start, end required" });
    }
    const data = await read.getAverageNutritionalQuantity(start, end, cut);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average nutrition" });
  }
});

// Sales Report
app.get("/api/profit/client", async (req, res) => {
  try {
    const { client, start, end } = req.query as any;
    if (!client || !start || !end) {
      return res.status(400).json({ error: "client, start, end required" });
    }
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
    if (!start || !end) {
      return res.status(400).json({ error: "start and end required" });
    }
    const data = await read.getTotalProfit(start, end);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total profit" });
  }
});

// Logistics Report
app.get("/api/deliveries/truck", async (req, res) => {
  try {
    const { truck, start, end } = req.query as any;
    if (!truck || !start || !end) {
      return res.status(400).json({ error: "truck, start, end required" });
    }
    const data = await read.getTotalDeliveriesByTruck(
      Number(truck),
      start,
      end
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch total deliveries by truck" });
  }
});

app.get("/api/deliveries/distance-duration", async (req, res) => {
  try {
    const { truck, start, end } = req.query as any;
    if (!truck || !start || !end) {
      return res.status(400).json({ error: "truck, start, end required" });
    }
    const data = await read.getDistanceToDurationRatio(
      Number(truck),
      start,
      end
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch distance-to-duration ratio" });
  }
});

// --- API ROUTES (Client View) ---

// Get Client Info
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

// Get Client Agreements
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

// Get Client Agreements with Agreement Number
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

// Get Client Transactions
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

// Create New Agreement
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
    const [rows] = (await pool.query(
      `SELECT restaurant_code FROM clients WHERE email_address = ?`,
      [email]
    )) as any[];
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    a.restaurant_code = rows[0].restaurant_code;

    // Coerce optional numeric fields
    a.weight = Number(a.weight);
    a.fat_content = a.fat_content ? Number(a.fat_content) : null;
    a.protein_content = a.protein_content ? Number(a.protein_content) : null;
    a.connective_tissue_content = a.connective_tissue_content
      ? Number(a.connective_tissue_content)
      : null;
    a.water_holding_capacity = a.water_holding_capacity
      ? Number(a.water_holding_capacity)
      : null;
    a.pH = a.pH ? Number(a.pH) : null;
    a.water_distribution = a.water_distribution
      ? Number(a.water_distribution)
      : null;

    await create.createAgreement(a);

    res.status(201).json({ message: "Agreement created successfully" });
  } catch (err) {
    console.error("Error creating agreement:", err);
    res.status(500).json({ error: "Failed to create agreement" });
  }
});

// Place New Order
app.post("/api/client/order", async (req, res) => {
  try {
    const { email_address, agreements } = req.body as {
      email_address: string;
      agreements: number[];
    };

    if (!email_address || !agreements || agreements.length === 0) {
      return res
        .status(400)
        .json({ error: "Email and agreements are required" });
    }

    // 1. Fetch restaurant_code from email
    const [clientRows] = (await pool.query(
      `SELECT restaurant_code FROM clients WHERE email_address = ?`,
      [email_address]
    )) as any[];

    if (!clientRows || clientRows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    const restaurant_code = clientRows[0].restaurant_code;

    // 2. Create a new delivery
    const delivery_id = await create.createDelivery({
      restaurant_code,
    });

    // 3. Create order lines for each selected agreement
    for (const agreement_no of agreements) {
      await create.createOrderLine({
        order_no: delivery_id, // This is the delivery_id (foreign key)
        agreement_no,
      });
    }

    res.status(201).json({ message: "Order placed successfully", delivery_id });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// --- SERVER START ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Press CTRL+C to stop server.");
});

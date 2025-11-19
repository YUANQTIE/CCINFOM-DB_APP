// --- server.ts ---
import express from "express";
import path from "path";
import cors from "cors";
import ejsLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";
import { pool } from "./db.ts";
import * as read from "./db_read.ts";
import * as create from "./db_create.ts";
import * as upd from "./db_update.ts";
import * as del from "./db_delete.ts";
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
app.use(express.json());
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));

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

app.post("/client-login", async (req, res) => {
  const emailInput = req.body.email?.trim();
  const records: any = await read.getClientEmails();

  let client = null;
  for (let i = 0; i < records.length; i++) {
    if (records[i].email_address === emailInput) {
      client = records[i];
      break;
    }
  }

  if (client) {
    const clientName = client.restaurant_name || client.email_address;
    const clientEmail = client.email_address;

    // Redirect with query params
    res.redirect(`/dashboard?name=${encodeURIComponent(clientName)}&email=${encodeURIComponent(clientEmail)}`);
  } else {
    res.send("Email not found. Please check your email or register first.");
  }
});


// GET dashboard
app.get("/dashboard", (req, res) => {
  const clientName = req.query.name as string;
  const clientEmail = req.query.email as string;

  if (!clientName || !clientEmail) {
    return res.redirect("/email_login");
  }

  res.render("client-view/index", { clientName, clientEmail });
});


app.get("/client-information", (req, res) => {
  const clientName = req.query.name as string;
  const clientEmail = req.query.email as string;

  if (!clientName || !clientEmail) {
    return res.redirect("/email_login");
  }

  res.render("client-view/client-information", { clientName, clientEmail });
});

app.get("/make_an_order", (req, res) => {
  const clientName = req.query.name as string;
  const clientEmail = req.query.email as string;

  if (!clientName || !clientEmail) {
    return res.redirect("/email_login");
  }

  res.render("client-view/make_an_order", { clientName, clientEmail });
});

app.get("/delete_order", (req, res) => {
  const clientName = req.query.name as string;
  const clientEmail = req.query.email as string;

  if (!clientName || !clientEmail) {
    return res.redirect("/email_login");
  }

  res.render("client-view/delete_order", { clientName, clientEmail });
});

app.get("/table_of_transactions", (req, res) => {
  const clientName = req.query.name as string;
  const clientEmail = req.query.email as string;

  if (!clientName || !clientEmail) {
    return res.redirect("/email_login");
  }

  res.render("client-view/delete_order", { clientName, clientEmail });
});



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

app.get("/process-livestock", (req, res) => {
  res.render("process-livestock");
});

app.get("/livestock/add", (req, res) => {
  res.render("add-livestock");
});

app.get("/suppliers", (req, res) => {
  res.render("tables/suppliers");
});

app.get("/deliver-products", (req, res) => {
  res.render("deliver-products");
});

app.get("/settings", (req, res) => {
  res.render("settings");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.get("/email_login", (req, res) => {
  res.render("auth/email_login");
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

// --- API ROUTES (Deliver a product) ---

app.get("/api/client-emails", async (req, res) => {
  try {
    const emails = await read.getClientEmails();
    res.json(emails); // sends [{ email_address: "..." }, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

app.post("/client-login", async (req, res) => {
  const { email } = req.body;

  try {
    // get emails and cast to any[] to avoid TS errors
    const emails = (await read.getClientEmails()) as any[];

    let exists = false;
    for (let i = 0; i < emails.length; i++) {
      if (emails[i].email_address === email) {
        exists = true;
        break;
      }
    }

    if (exists) {
      res.send(`Welcome back, ${email}!`);
    } else {
      res.send("Email not found. Please check your email or register first.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



// PROCESS 1

// Get pending deliveries
app.get("/api/company/pending-deliveries", async (req, res) => {
  try {
    const deliveries = await read.getCompanyPendingDeliveries();
    console.log("Deliveries fetched:", deliveries); // debug
    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching pending deliveries:", err);
    res.status(500).json({ error: "Failed to fetch pending deliveries" });
  }
});

// Assign driver and truck
app.post("/api/company/assign-delivery", async (req, res) => {
  try {
    const { delivery_no, driver_name, truck_number } = req.body;
    if (!delivery_no || !driver_name || !truck_number)
      return res.status(400).json({ error: "All fields are required" });

    await pool.query(
      `UPDATE deliveries SET driver_name = ?, truck_number = ? WHERE delivery_no = ?`,
      [driver_name, truck_number, delivery_no]
    );

    res.json({ message: "Delivery assigned successfully" });
  } catch (err) {
    console.error("Error assigning delivery:", err);
    res.status(500).json({ error: "Failed to assign delivery" });
  }
});

// PROCESS 2

// Get pending deliveries
app.get("/api/company/pending-deliveries", async (req, res) => {
  try {
    const deliveries = await read.getCompanyPendingDeliveries();
    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching pending deliveries:", err);
    res.status(500).json({ error: "Failed to fetch pending deliveries" });
  }
});

// Get order lines within the chosen pending delivery
app.get(
  "/api/company/pending-deliveries/:delivery_no/order-lines",
  async (req, res) => {
    try {
      const delivery_no = Number(req.params.delivery_no);
      if (isNaN(delivery_no))
        return res.status(400).json({ error: "Invalid delivery number" });

      const orderLines = await read.getCompanyOrderLinesInPendingDelivery(
        delivery_no
      );
      res.json(orderLines);
    } catch (err) {
      console.error("Error fetching order lines:", err);
      res.status(500).json({ error: "Failed to fetch order lines" });
    }
  }
);

// Get the possible meat selection options for that order line
app.get("/api/order-line/:order_line_id/meat-selection", async (req, res) => {
  try {
    const order_line_id = Number(req.params.order_line_id);
    if (isNaN(order_line_id))
      return res.status(400).json({ error: "Invalid order line ID" });

    const selections = await read.getPossibleMeatSelectionForOrder(
      order_line_id
    );
    res.json(selections);
  } catch (err) {
    console.error("Error fetching meat selection:", err);
    res.status(500).json({ error: "Failed to fetch meat selection" });
  }
});

// Update status of meat selection
app.post("/api/meat-selection/reserve", async (req, res) => {
  try {
    const { serial_no, order_line_id } = req.body;
    if (!serial_no || !order_line_id)
      return res
        .status(400)
        .json({ error: "serial_no and order_line_id are required" });

    await upd.updateMeatSelectionReservedStatus(serial_no);
    await upd.updateOrderLineReservedStatus(order_line_id, serial_no);

    res.json({ message: "Meat selection reserved successfully" });
  } catch (err) {
    console.error("Error reserving meat selection:", err);
    res.status(500).json({ error: "Failed to reserve meat selection" });
  }
});

// PROCESS 3

// Get the pending deliveries that are ready to be delivered
app.get("/api/company/pending-deliveries-ready", async (req, res) => {
  try {
    const deliveries =
      await read.getCompanyPendingDeliveriesThatCanBeDelivered();
    res.json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching deliveries" });
  }
});

// Update the delivery status to delivered
app.put("/api/delivery/update/:deliveryNo", async (req, res) => {
  const deliveryNo = Number(req.params.deliveryNo);
  const { distanceTraveled, deliveryDuration } = req.body;

  try {
    // 1. Mark meat as sold
    await upd.updateSoldMeatSelection(deliveryNo);

    // 2. Update distance
    if (distanceTraveled !== undefined) {
      await upd.updateDeliveryDistance(deliveryNo, distanceTraveled);
    }

    // 3. Update duration
    if (deliveryDuration !== undefined) {
      await upd.updateDeliveryDuration(deliveryNo, deliveryDuration);
    }

    await upd.updateDeliveryDate(deliveryNo);

    // 4. Mark delivery as delivered
    await upd.updateDeliveredDelivery(deliveryNo, "Delivered");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating delivery" });
  }
});

app.get("/company/assign-driver", (req, res) => {
  res.render("deliver_product/process1");
});

app.get("/company/assign-meat-selection", (req, res) => {
  res.render("deliver_product/process2");
});

app.get("/company/deliver-product", (req, res) => {
  res.render("deliver_product/process3");
});


// --- API ROUTES (Reports) ---

// Livestock Keeping Report

app.get("/api/average-condition-ratio", async (req, res) => {
  try {
    // allow undefined
    const { start, end, supplier_name } = req.query as { start: string; end: string; supplier_name: string };

    // No more "if (!start)" check. Just pass whatever we have.
    const data = await read.getAverageConditionRatio(start, end, supplier_name);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
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

app.get("/api/meat-produced", async (req, res) => {
  try {
    const { date_start, date_end, meat_cut } = req.query;

    if (!date_start || !date_end || !meat_cut) {
      return res.status(400).json({
        error: "date_start, date_end, and meat_cut are required",
      });
    }

    const data = await read.getProducedMeatSelections(
      date_start as string,
      date_end as string,
      meat_cut as string
    );

    res.json(data);
  } catch (err) {
    console.error("Error fetching produced meat selections:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.get("/api/unique-trucks", async (req, res) => {
  try {
    const trucks = await read.getUniqueTrucks();
    res.json(trucks); // return as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unique trucks" });
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

// Agreement Satisfaction

app.get("/api/reports/late", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "start and end dates are required" });
  }

  try {
    const count = await read.getLateReports(start as string, end as string);
    res.json({ late_count: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching late reports" });
  }
});

app.get("/api/reports/nutrition", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Start and end dates are required" });
  }

  try {
    const data = await read.getNutritionFulfillmentPercentages(
      start as string,
      end as string
    );
    res.json(data);
  } catch (err) {
    console.error("Nutrition API error:", err);
    res.status(500).json({ error: "Error fetching nutrition percentages" });
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

// Make an order
// Creates new delivery record
app.post("/api/client/create-delivery", async (req, res) => {
  try {
    const { email_address } = req.body as { email_address: string };

    if (!email_address) {
      return res.status(400).json({ error: "Email is required" });
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

    // 2. Create a new delivery (The main goal of this endpoint)
    const delivery_id = await create.createDelivery({ restaurant_code });

    res.status(201).json({ message: "Delivery session started", delivery_id });
  } catch (err) {
    console.error("Error starting delivery session:", err);
    res.status(500).json({ error: "Failed to start delivery session" });
  }
});

// Adds order lines to that delivery record
app.post("/api/client/add-order-lines", async (req, res) => {
  try {
    const { delivery_id, agreements } = req.body as {
      delivery_id: number;
      agreements: number[];
    };

    if (!delivery_id || !agreements || agreements.length === 0) {
      return res
        .status(400)
        .json({ error: "Delivery ID and agreements are required" });
    }

    // 1. Create order lines for each selected agreement
    for (const agreement_no of agreements) {
      await create.createOrderLine({
        order_no: delivery_id, // Use the existing delivery_id
        agreement_no,
      });
    }

    res.status(201).json({
      message: "Order lines added successfully to delivery " + delivery_id,
    });
  } catch (err) {
    console.error("Error adding order lines:", err);
    res.status(500).json({ error: "Failed to add order lines" });
  }
});

// Delete order
// Gets client's pending orders
app.get("/api/client/pending-orders", async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "email is required" });

    const data = await read.getClientPendingOrders(email);
    res.json(data);
  } catch (err) {
    console.error("Error loading pending orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Deletes the selected order_lines
app.delete("/api/order-line/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log("DELETE /api/order-line/", id);

    const result = await del.cancelOrderLine(id);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error cancelling order line:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- SERVER START ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Press CTRL+C to stop server.");
});

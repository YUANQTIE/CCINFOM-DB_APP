import express from "express";
import path from "path";
import cors from "cors";
import { pool } from "./db.ts";
import * as read from "./db_read.ts";
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

app.get("/api/meat-selection", async (req, res) => {
  try {
    const data = await read.getMeatSelection()
    res.json(data);
  } catch (err) {
    res.status(500).json({error: "Failed to fetch meat selection"})
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

import express from "express";
import path from "path";
import { pool } from "./db.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.static(path.join(__dirname), {
    extensions: ["html"],
  })
);
app.use(express.static(path.join(__dirname, "../resources")));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("You can now open:");
  console.log(`  - http://localhost:${port}`);
});

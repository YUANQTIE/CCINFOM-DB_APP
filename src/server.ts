import express from "express";
import path from "path";
import cors from "cors";
import meatSelectionRoutes from "./routes/meatSelectionRoutes.ts";
import livestockRoutes from "./routes/livestockRoutes.ts"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())
app.use(express.static("public"));

app.use("/api/meat-selection", meatSelectionRoutes);
app.use("/api/livestock", livestockRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log("You can now open:");
    console.log(`  - http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import { PRODUCTS } from "./src/products.js";

const app = express();
app.use(cors());
app.use(express.json());

const SERVICE = "product-service";
const PREFIX = `/api/${SERVICE}`;
const PORT = process.env.PORT || 3001;

app.get(`${PREFIX}/health`, (req, res) => {
  res.json({
    service: SERVICE,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get(`${PREFIX}/products`, (req, res) => {
  res.json({ count: PRODUCTS.length, data: PRODUCTS });
});

app.listen(PORT, () => {
  console.log(`[${SERVICE}] listening on ${PORT}`);
});

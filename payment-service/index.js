import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SERVICE = "payment-service";
const PREFIX = `/api/${SERVICE}`;
const PORT = process.env.PORT || 3002;

app.get(`${PREFIX}/health`, (req, res) => {
  res.json({
    service: SERVICE,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Example resource endpoint
app.get(`${PREFIX}/payments`, (req, res) => {
  res.json({
    count: 2,
    data: [
      { id: "PM-2001", amount: 45.0, currency: "USD", status: "captured" },
      { id: "PM-2002", amount: 19.99, currency: "USD", status: "pending" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[${SERVICE}] listening on ${PORT}`);
});

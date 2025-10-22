import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SERVICE = "user-service";
const PREFIX = `/api/${SERVICE}`;
const PORT = process.env.PORT || 3003;

app.get(`${PREFIX}/health`, (req, res) => {
  res.json({
    service: SERVICE,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Example resource endpoint
app.get(`${PREFIX}/users`, (req, res) => {
  res.json({
    count: 2,
    data: [
      { id: "U-3001", name: "Jordan (Customer Supporter)" },
      { id: "U-3002", name: "Bipro" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[${SERVICE}] listening on ${PORT}`);
});

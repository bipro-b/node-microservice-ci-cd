import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const targets = {
  "product-service": "http://localhost:3001/api/product-service",
  "payment-service": "http://localhost:3002/api/payment-service",
  "user-service": "http://localhost:3003/api/user-service"
};

app.get("/api/gateway/health", (req, res) => {
  console.log("check-helath");
  res.json({ service: "gateway-service", status: "ok", targets, uptime: process.uptime() });
});

const attachProxy = (prefix, target) => {
  console.log(`[gateway] Attaching proxy for /api/${prefix} -> ${target}`);
  app.use(
    `/api/${prefix}`,

    createProxyMiddleware({
      target,
      changeOrigin: true,
      
      // 🔑 KEY FIX: Strip the prefix (e.g., /api/product-service)
      pathRewrite: {
        // This regex matches the prefix at the start of the path and replaces it with nothing.
        // For 'product-service', it will match '^/api/product-service'
        [`^/api/${prefix}`]: '', 
      },
    })
  );
};

// ... (rest of your code remains the same)

attachProxy("product-service", targets["product-service"]);
attachProxy("payment-service", targets["payment-service"]);
attachProxy("user-service", targets["user-service"]);

app.listen(PORT, () => {
  console.log(`[gateway-service] listening on ${PORT}`);
  console.log(`[gateway-service] Targets:`, targets);
});

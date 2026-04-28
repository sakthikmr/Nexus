import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Import Routers
import vendorRoutes from "./server/routes/vendors.ts";
import recruitmentRoutes from "./server/routes/recruitment.ts";
import financeRoutes from "./server/routes/finance.ts";
import adminRoutes from "./server/routes/admin.ts";
import supportRoutes from "./server/routes/support.ts";
import procurementRoutes from "./server/routes/procurement.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Initializing Coherent Nexus REST API...");

  app.use(express.json());

  // Global Middleware for Logging & Tenant Headers
  app.use((req, res, next) => {
    const vendorId = req.header('X-Vendor-ID');
    if (vendorId) {
      console.log(`[TENANT] Accessing data for Vendor: ${vendorId}`);
    }
    next();
  });

  // API Route Registration
  app.use("/api/v1/vendors", vendorRoutes);
  app.use("/api/v1/recruitment", recruitmentRoutes);
  app.use("/api/v1/finance", financeRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/v1/support", supportRoutes);
  app.use("/api/v1/procurement", procurementRoutes);

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "Coherent Nexus API is operational", version: "1.0.0", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coherent Nexus Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start Nexus Server:", err);
});


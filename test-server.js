import express from "express";
import publicRoutes from "./src/routers/public.js";

const app = express();

app.get("/api", (req, res) => res.json({ ok: true }));
app.use("/api/public", publicRoutes);

const server = app.listen(5001, () => {
  console.log("Test server on port 5001");
});

// Test request
setTimeout(async () => {
  try {
    const res = await fetch("http://localhost:5001/api/public/profile");
    console.log("Response status:", res.status);
    const text = await res.text();
    console.log("Response body:", text.substring(0, 200));
  } catch (e) {
    console.log("Error:", e.message);
  }
  server.close();
  process.exit(0);
}, 1000);


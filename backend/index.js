const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// --- MongoDB Connections ---
// Main inventory system DB
mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost:27017/inv_system")
  .then(() => console.log("MongoDB (inventory) connected successfully"))
  .catch((err) => console.log("MongoDB connection failed:", err));

// Removed duplicate MongoDB connection; newsletter data will use the same inventory DB.

// --- Load Models ---
require("./model/Store");
require("./model/User");
require("./model/Category");
require("./model/Product");
require("./model/Supplier");
require("./model/Purchase");
require("./model/PurchaseItem");
require("./model/Sale");
require("./model/SaleItem");
require("./model/ActivityLog");

// --- Load Routes ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const purchaseItemRoutes = require("./routes/purchaseItemRoutes");
const salesRoutes = require("./routes/salesRouter");
const saleItemRoutes = require("./routes/saleItemRoutes");

// --- Register API Routes ---
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", storeRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", supplierRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", purchaseItemRoutes);
app.use("/api", salesRoutes);
app.use("/api", saleItemRoutes);

// --- Base route ---
app.get("/", (req, res) => {
  res.json({ message: "MeroByapar API is running!" });
});

// --- Newsletter functionality directly in index.js ---
// Subscriber Schema
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

// Model for newsletter subscribers
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// POST /api/newsletter/subscribe
app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already subscribed" });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(200).json({ message: "Subscribed successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Error Handling Middleware ---
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

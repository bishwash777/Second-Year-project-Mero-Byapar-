

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// ── Change these before running ──────────────────────────────────────────
const ADMIN_NAME     = "Admin";
const ADMIN_EMAIL    = "aaryankoirala20@gmail.com";
const ADMIN_PASSWORD = "wiki@11";          // change to something strong!
// ─────────────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ["admin", "manager", "cashier", "pending"], default: "pending" },
  store_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive:   { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  otp:        { type: String, default: null },
  otpExpiry:  { type: Date,   default: null },
}, { timestamps: true });

async function seedAdmin() {
  try {
    // Connect to DB
    const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/inv_system";
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB:", mongoUrl);

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === "admin") {
        console.log("⚠️  Admin already exists with this email:", ADMIN_EMAIL);
        console.log("    Role:", existing.role);
        console.log("    If you forgot the password, change ADMIN_PASSWORD above and delete the existing user first.");
      } else {
        // Upgrade existing user to admin
        existing.role      = "admin";
        existing.isActive  = true;
        existing.isVerified = true;
        await existing.save();
        console.log("✅ Existing user upgraded to admin:", ADMIN_EMAIL);
      }
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin
    const admin = new User({
      name:       ADMIN_NAME,
      email:      ADMIN_EMAIL,
      password:   hashedPassword,
      role:       "admin",
      isActive:   true,
      isVerified: true,    // admin doesn't need email verification
      otp:        null,
      otpExpiry:  null,
    });

    await admin.save();

    console.log("\n🎉 Admin created successfully!\n");
    console.log("─────────────────────────────────");
    console.log("  Email   :", ADMIN_EMAIL);
    console.log("  Password:", ADMIN_PASSWORD);
    console.log("  Role    : admin");
    console.log("─────────────────────────────────");
    console.log("\n⚠️  IMPORTANT: Delete this file (seedAdmin.js) after use!\n");

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
}

seedAdmin();

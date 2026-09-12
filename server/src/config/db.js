const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "[db] MONGODB_URI is not set. The API will run, but every request that " +
        "touches the database will fail until it is configured. See .env.example."
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("[db] Connected to MongoDB.");
  } catch (err) {
    console.error("[db] Failed to connect to MongoDB:", err.message);
  }
}

function dbIsConnected() {
  return isConnected || mongoose.connection.readyState === 1;
}

module.exports = { connectDB, dbIsConnected };

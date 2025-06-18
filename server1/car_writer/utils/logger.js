const fetch = require("node-fetch");

async function logToServer(source, action, data) {
  try {
    await fetch("http://localhost:5003/ms3/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source,
        action,
        data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("Failed to log to server2:", err.message);
    throw new Error(`Failed to log to server2: ${err.message}`);
  }
}

module.exports = logToServer;

const fetch = require("node-fetch");

// const origin = "https://bookish-guide-v5pw5vq9vxr2wjj4-5003.app.github.dev";
const origin = "http://192.168.0.68:5003";

async function logToServer(user_id, source, action, data) {
  try {
    await fetch(`${origin}/ms3/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
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

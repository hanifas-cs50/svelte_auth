const fetch = require("node-fetch");

// const origin = "https://bookish-guide-v5pw5vq9vxr2wjj4-5004.app.github.dev";
const origin = "http://192.168.0.68:5004";

async function getUsers(userIds) {
  try {
    const res = await fetch(`${origin}/user/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds }),
    });
    return await res.json() || null;
  } catch (err) {
    console.error("Failed to log to server2:", err.message);
    throw new Error(`Failed to log to server2: ${err.message}`);
  }
}

module.exports = getUsers;

const fetch = require("node-fetch");

async function getUsers(userIds) {
  try {
    const res = await fetch("http://localhost:5004/user/get", {
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

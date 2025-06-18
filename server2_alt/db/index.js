const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");
const { logs } = require("./schema");

const sqlite = new Database("./logs.db");
const db = drizzle(sqlite, { schema: logs });

module.exports = { db, logs };

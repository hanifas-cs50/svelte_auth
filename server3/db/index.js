const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");
const { users } = require("./schema");

const sqlite = new Database("./users.db");
const db = drizzle(sqlite, { schema: users });

module.exports = { db, users };

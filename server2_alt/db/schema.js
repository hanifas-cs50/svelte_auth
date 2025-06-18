const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

const logs = sqliteTable("logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").notNull(),
  source: text("source").notNull(),
  action: text("action").notNull(),
  data: text("data").notNull(),
  timestamp: text("timestamp").notNull(),
});

module.exports = { logs };

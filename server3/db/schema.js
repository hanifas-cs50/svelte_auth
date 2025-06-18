const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

module.exports = { users };

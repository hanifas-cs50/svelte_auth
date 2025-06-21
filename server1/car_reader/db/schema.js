const { sqliteTable, text, integer, real } = require("drizzle-orm/sqlite-core");

const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").unique(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  price: real("price").notNull(),
});

module.exports = { cars };
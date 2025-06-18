/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./db/schema.js",
  out: "../shared/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./users.db"
  }
};

const { db, logs } = require("../db/index");
const { desc, eq } = require("drizzle-orm");
const getUsers = require("../utils/getUsers");

async function logsRoutes(fastify, options) {
  fastify.get("/logs", async (request, reply) => {
    try {
      const getLogs = await db
        .select()
        .from(logs)
        .orderBy(desc(logs.timestamp));
      const userIds = [...new Set(getLogs.map((log) => log.user_id))];

      try {
        const users = await getUsers(userIds);
        const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
        const result = logs.map((log) => ({
          ...log,
          user: userMap[log.user_id] || null,
        }));
        reply.send(result);
      } catch (userErr) {
        console.error("Get logs failed: ", userErr);
        return reply.status(500).send({ error: "Failed to fetch users" });
      }
    } catch (err) {
      console.error(err);
      reply.status(404).send({ error: "Logs not found" });
    }
  });

  fastify.get("/log/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const [log] = await db
        .select()
        .from(logs)
        .where(eq(logs.id, id));
      const userId = [log.user_id];

      if (!log) {
        return reply.status(404).send({ error: "Log not found" });
      }

      try {
        const [user] = await getUsers(userId);
        const result = { ...log, user };
        reply.send(result);
      } catch (userErr) {
        console.error("Get log failed: ", userErr);
        return reply.status(500).send({ error: "Failed to fetch user" });
      }
    } catch (err) {
      console.error(err);
      reply.status(404).send({ error: "Failed to fetch log" });
    }
  });

  fastify.post("/log", async (request, reply) => {
    const { user_id, source, action, data, timestamp } = request.body;

    if (!user_id || !source || !action || !data || !timestamp) {
      return reply
        .status(400)
        .send({ error: "All query are required." });
    }

    try {
      await db.insert(logs).values({
        user_id,
        source: JSON.stringify(source),
        action,
        data: JSON.stringify(data),
        timestamp: String(timestamp),
      });
      reply.status(201).send({ message: "Log created" });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Failed to create log" });
    }
  });
}

module.exports = logsRoutes;

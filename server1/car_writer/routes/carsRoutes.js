const { eq } = require("drizzle-orm");
const logToServer = require("../utils/logger");

async function carsRoutes(fastify, options) {
  const { db, cars } = require("../db/index");

  fastify.post("/cars", async (request, reply) => {
    const ip = request.ip;
    const userAgent = request.headers["user-agent"];
    const { brand, model, price } = request.body;
    const session = request.unsignCookie(request.cookies.session);

    if (!session.valid) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const user_id = parseInt(session.value);

    if (!brand?.trim() || !model?.trim() || price === undefined || isNaN(price)) {
      return reply
        .status(400)
        .send({ error: "Brand, model, and price are required." });
    }

    try {
      const [result] = await db
        .insert(cars)
        .values({ brand, model, price })
        .returning({ insertedId: cars.id });

      const newCar = { id: result.insertedId, brand, model, price };

      try {
        await logToServer(user_id, { ip, userAgent }, "POST", newCar);
      } catch (logErr) {
        console.error("Logging failed: ", logErr);
        await db.delete(cars).where(eq(cars.id, newCar.id));
      return reply.status(500).send({ error: "Failed to log transaction." });
      }

      reply.status(201).send({ message: "Car created", value: newCar });
    } catch (err) {
      console.error("DB insert failed: ", err);
      reply.status(500).send({ error: "Failed to create car" });
    }
  });

  fastify.put("/cars/:id", async (request, reply) => {
    const ip = request.ip;
    const userAgent = request.headers["user-agent"];
    const { id } = request.params;
    const { brand, model, price } = request.body;
    const session = request.unsignCookie(request.cookies.session);

    if (!session.valid) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const user_id = parseInt(session.value);

    if (
      user_id === undefined ||
      isNaN(user_id) ||
      !brand?.trim() ||
      !model?.trim() ||
      price === undefined ||
      isNaN(price)
    ) {
      return reply
        .status(400)
        .send({ error: "User ID, brand, model, and price are required." });
    }

    try {
      try {
        await logToServer(user_id, { ip, userAgent }, "PUT", {
          id,
          model,
          brand,
          price,
        });
      } catch (logErr) {
        console.error("Logging failed: ", logErr);
        return reply.status(500).send({ error: "Failed to log transaction" });
      }

      const result = await db
        .update(cars)
        .set({ brand, model, price })
        .where(eq(cars.id, id));

      if (result.rowCount === 0) {
        return reply.status(404).send({ error: "Car not found" });
      }

      reply.status(200).send({ message: "Car updated successfully" });
    } catch (err) {
      console.error("DB update failed: ", err);
      reply.status(500).send({ error: "Failed to update car" });
    }
  });

  fastify.delete("/cars/:id", async (request, reply) => {
    const ip = request.ip;
    const userAgent = request.headers["user-agent"];
    const { id } = request.params;
    const session = request.unsignCookie(request.cookies.session);

    if (!session.valid) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const user_id = parseInt(session.value);

    if (user_id === undefined || isNaN(user_id)) {
      return reply.status(400).send({ error: "User ID is required." });
    }

    try {
      try {
        await logToServer(user_id, { ip, userAgent }, "DELETE", { id });
      } catch (logErr) {
        console.error("Logging failed: ", logErr);
        return reply.status(500).send({ error: "Failed to log transaction" });
      }

      const result = await db.delete(cars).where(eq(cars.id, id));

      if (result.rowCount === 0) {
        return reply.status(404).send({ error: "Car not found" });
      }

      reply.status(201).send({ message: "Car deleted" });
    } catch (err) {
      console.error("DB delete failed: ", err);
      reply.status(500).send({ error: "Failed to delete car" });
    }
  });
}

module.exports = carsRoutes;

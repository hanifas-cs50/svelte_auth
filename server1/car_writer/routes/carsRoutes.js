const { eq } = require("drizzle-orm");
const logToServer = require("../utils/logger");
const { db, cars } = require("../db/index");
const { encryptId, decryptId } = require("../utils/aes");

async function carsRoutes(fastify, options) {
  fastify.post("/cars", async (request, reply) => {
    const session = request.unsignCookie(request.cookies.session);
    const ip = request.ip;
    const userAgent = request.headers["user-agent"];
    const { brand, model, price } = request.body;

    if (!session.valid)
      return reply.status(401).send({ error: "Unauthorized" });

    const user_id = parseInt(session.value);
    if (!user_id)
      return reply.status(400).send({ error: "User ID is required." });

    if (!brand?.trim() || !model?.trim() || isNaN(price)) {
      return reply
        .status(400)
        .send({ error: "Brand, model, and price are required." });
    }

    try {
      const [car] = await db
        .insert(cars)
        .values({ brand, model, price })
        .returning({ insertedId: cars.id });

      const uuid = encryptId(car.insertedId);
      if (!uuid) return reply.status(500).send({ error: "Encryption failed" });

      await db.update(cars).set({ uuid }).where(eq(cars.id, car.insertedId));

      const newCar = { uuid, brand, model, price };

      try {
        await logToServer(user_id, { ip, userAgent }, "POST", newCar);
      } catch (logErr) {
        console.error("Logging failed: ", logErr);
        await db.delete(cars).where(eq(cars.id, car.insertedId));
        return reply.status(500).send({ error: "Failed to log transaction." });
      }

      reply.status(201).send({ message: "Car created", value: newCar });
    } catch (err) {
      console.error("DB insert failed: ", err);
      reply.status(500).send({ error: "Failed to create car" });
    }
  });

  fastify.put("/cars/:uuid", async (request, reply) => {
    const { uuid } = request.params;
    const session = request.unsignCookie(request.cookies.session);
    const ip = request.ip;
    const userAgent = request.headers["user-agent"];
    const { brand, model, price } = request.body;

    if (!session.valid)
      return reply.status(401).send({ error: "Unauthorized" });

    const user_id = parseInt(session.value);
    if (!user_id)
      return reply.status(400).send({ error: "User ID is required." });

    const id = decryptId(uuid);
    if (!id) return reply.status(400).send({ error: "Invalid UUID." });

    if (!brand?.trim() || !model?.trim() || isNaN(price)) {
      return reply
        .status(400)
        .send({ error: "Brand, model, and price are required." });
    }

    try {
      await logToServer(user_id, { ip, userAgent }, "PUT", {
        uuid,
        model,
        brand,
        price,
      });

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

  fastify.delete("/cars/:uuid", async (request, reply) => {
    const { uuid } = request.params;
    const session = request.unsignCookie(request.cookies.session);
    const ip = request.ip;
    const userAgent = request.headers["user-agent"];

    if (!session.valid)
      return reply.status(401).send({ error: "Unauthorized" });

    const user_id = parseInt(session.value);
    if (!user_id)
      return reply.status(400).send({ error: "User ID is required." });

    const id = decryptId(uuid);
    if (!id) return reply.status(400).send({ error: "Invalid UUID." });

    try {
      await logToServer(user_id, { ip, userAgent }, "DELETE", { uuid });

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

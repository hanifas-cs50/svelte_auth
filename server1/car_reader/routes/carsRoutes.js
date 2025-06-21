const { eq } = require("drizzle-orm");
const { db, cars } = require("../db/index");
const { decryptId } = require("../utils/aes");

async function carsRoutes(fastify, options) {
  fastify.get("/cars", async (request, reply) => {
    try {
      const result = await db
        .select({
          uuid: cars.uuid,
          brand: cars.brand,
          model: cars.model,
          price: cars.price,
        })
        .from(cars);
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply.status(404).send({ error: "Cars not found" });
    }
  });

  fastify.get("/car/:uuid", async (request, reply) => {
    const { uuid } = request.params;
    // console.log(uuid);

    const id = decryptId(uuid);
    if (!id) return reply.status(400).send({ error: "Invalid UUID." });

    try {
      const [car] = await db
        .select({
          uuid: cars.uuid,
          brand: cars.brand,
          model: cars.model,
          price: cars.price,
        })
        .from(cars)
        .where(eq(cars.id, id));

      if (!car) {
        return reply.status(404).send({ error: "Car not found" });
      }

      reply.send(car);
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Failed to fetch car" });
    }
  });
}

module.exports = carsRoutes;

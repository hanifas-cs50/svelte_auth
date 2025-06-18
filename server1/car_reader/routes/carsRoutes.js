const { db, cars } = require("../db/index");
const { eq } = require("drizzle-orm");

async function carsRoutes(fastify, options) {

  fastify.get("/cars", async (request, reply) => {
    try {
      const result = await db.select().from(cars);
      reply.send(result);
    } catch (err) {
      console.error(err);
      reply.status(404).send({ error: "Cars not found" });
    }
  });

  fastify.get("/car/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const [car] = await db.select().from(cars).where(eq(cars.id, id));

      if (!car) {
        return reply.status(404).send({ error: "Car not found" });
      }
      
      reply.send(car);
    } catch (err) {
      console.error(err);
      reply.status(404).send({ error: "Failed to fetch car" });
    }
  });
}

module.exports = carsRoutes;
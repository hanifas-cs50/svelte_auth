const Fastify = require("fastify");
const cors = require("@fastify/cors");
const carsRoutes = require("./carsRoutes");

const app = Fastify();

app.register(cors, {
  origin: "http://192.168.0.68:5173",
  methods: ["GET"],
});

app.get("/health", () => ({ status: "car-reader up" }));

app.register(carsRoutes, { prefix: "/ms1" });

app.listen({ host: "0.0.0.0", port: 5001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});

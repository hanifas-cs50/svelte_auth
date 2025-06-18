const Fastify = require("fastify");
const cors = require("@fastify/cors");
const carsRoutes = require("./carsRoutes");

const app = Fastify({ trustProxy: true });

app.register(cors, {
  origin: "http://192.168.0.68:5173",
  methods: ["POST", "DELETE", "PUT"],
});

app.get("/health", () => ({ status: "car-writer up" }));

app.register(carsRoutes, { prefix: "/ms2" });

app.listen({ host: "0.0.0.0", port: 5002 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});

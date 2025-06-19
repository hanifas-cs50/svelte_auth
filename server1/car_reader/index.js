const Fastify = require("fastify");
const cors = require("@fastify/cors");
const carsRoutes = require("./routes/carsRoutes");

const app = Fastify();

app.register(cors, {
  origin: "https://bookish-guide-v5pw5vq9vxr2wjj4-5173.app.github.dev/",
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

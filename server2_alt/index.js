const Fastify = require("fastify");
const cors = require("@fastify/cors");
const logsRoutes = require("./logsRoutes");

const app = Fastify();

app.register(cors, {
  origin: "https://bookish-guide-v5pw5vq9vxr2wjj4-5173.app.github.dev/",
  methods: ["GET"],
});

app.get("/health", () => ({ status: "logger up" }));

app.register(logsRoutes, { prefix: "/ms3" });

app.listen({ host: "0.0.0.0", port: 5003 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});

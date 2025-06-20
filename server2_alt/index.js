const Fastify = require("fastify");
const cors = require("@fastify/cors");
const logsRoutes = require("./routes/logsRoutes");

const app = Fastify();

// const origin = "https://bookish-guide-v5pw5vq9vxr2wjj4-5173.app.github.dev";
const origin = "http://192.168.0.68:5173";

app.register(cors, {
  origin: origin,
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

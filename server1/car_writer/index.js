const Fastify = require("fastify");
const cors = require("@fastify/cors");
const { fastifyCookie: cookie } = require("@fastify/cookie");
const carsRoutes = require("./routes/carsRoutes");

const app = Fastify({ trustProxy: true });

// const origin = "https://bookish-guide-v5pw5vq9vxr2wjj4-5173.app.github.dev";
const origin = "http://192.168.0.68:5173";

app.register(cors, {
  origin: origin,
  methods: ["POST", "DELETE", "PUT"],
  credentials: true,
});

app.register(cookie, {
  secret: "QQp8bgYDvt1MrgZPCBkHDwR005yV7TIiJ66kMz0+9kk=",
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

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const { fastifyCookie: cookie } = require("@fastify/cookie");
const authRoutes = require("./routes/authRoutes");

const app = Fastify();

// const origin = "https://bookish-guide-v5pw5vq9vxr2wjj4-5173.app.github.dev";
const origin = "http://192.168.0.68:5173";

app.register(cors, {
  origin: origin,
  methods: ["GET", "POST"],
  credentials: true,
});

app.register(cookie, {
  secret: "QQp8bgYDvt1MrgZPCBkHDwR005yV7TIiJ66kMz0+9kk=",
});

app.get("/health", () => ({ status: "authentication up" }));

app.register(authRoutes, { prefix: "/user" });

app.listen({ host: "0.0.0.0", port: 5004 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});

// On a work environment, put secret on a .env
// And as usual do this to generate the secret:
// node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

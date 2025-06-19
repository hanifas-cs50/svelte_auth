const Fastify = require("fastify");
const cors = require("@fastify/cors");
const authRoutes = require("./routes/authRoutes");
const { fastifyCookie: cookie } = require("@fastify/cookie");

const app = Fastify({ trustProxy: true });

app.register(cors, {
  origin: "https://bookish-guide-v5pw5vq9vxr2wjj4-5173.app.github.dev",
  methods: ["GET", "POST"],
  credentials: true
});

app.register(cookie, {
	secret: 'QQp8bgYDvt1MrgZPCBkHDwR005yV7TIiJ66kMz0+9kk=', // On a work environment, put this on a .env
});
// And as usual do this (below) to generate the secret
// node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

app.get("/health", () => ({ status: "authentication up" }));

app.register(authRoutes, { prefix: "/user" });

app.listen({ host: "0.0.0.0", port: 5004 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});

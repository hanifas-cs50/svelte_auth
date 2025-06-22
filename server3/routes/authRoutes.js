const { db, users } = require("../db/index");
const { inArray, eq } = require("drizzle-orm");
const { compare, hash } = require("bcrypt");

async function authRoutes(fastify, options) {
  fastify.post("/get", async (request, reply) => {
    const { userIds } = request.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return reply
        .status(400)
        .send({ error: "userIds must be a non-empty array" });
    }

    try {
      const result = await db
        .select({ id: users.id, username: users.username, email: users.email })
        .from(users)
        .where(inArray(users.id, userIds));

      return reply.send(result);
    } catch (err) {
      console.error("DB Error:", err);
      return reply.status(500).send({ error: "Failed to fetch users" });
    }
  });

  fastify.post("/register", async (request, reply) => {
    const { email, username, password } = request.body;
    // console.log(request.body);

    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      return reply
        .status(400)
        .send({ error: "Email, username, and password are required." });
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    // console.log(existing);
    if (existing.length > 0) {
      return reply.status(400).send({ error: "Email already registered" });
    }

    const hashed = await hash(password, 10);

    try {
      await db.insert(users).values({ email, username, password: hashed });

      reply.status(201).send({ message: "User created" });
    } catch (err) {
      console.error("DB insert failed: ", err);
      reply.status(500).send({ error: "Failed to create user" });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;
    // console.log(request.body);

    if (!email?.trim() || !password?.trim()) {
      return reply
        .status(400)
        .send({ error: "Username and password are required." });
    }

    try {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!result) {
        return reply.status(400).send({ error: "Invalid credentials" });
      }

      const match = await compare(password, result.password);
      if (!match) {
        return reply.status(400).send({ error: "Invalid credentials" });
      }

      reply.setCookie("session", result.id.toString(), {
        path: "/",
        httpOnly: true, // change to "false" when using github codespace
        sameSite: "lax", // change to "none" when using github codespace
        secure: false, // change to "true" when using github codespace
        maxAge: 60 * 60 * 24,
        signed: true
      });

      reply.status(201).send({ message: "Logged in" });
    } catch (err) {
      console.error("DB select failed: ", err);
      reply.status(500).send({ error: "Failed to login user" });
    }
  });

  fastify.get("/me", async (request, reply) => {
    const session = request.cookies.session;
    if (!session) return reply.status(400).send({ error: "Not authenticated" });

    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session)));

    if (!result) return reply.status(400).send({ error: "Invalid session" });

    reply.send({ id: result.id, username: result.username });
  });

  fastify.post("/logout", async (request, reply) => {
    reply.clearCookie("session", { path: "/" });
    reply.send({ message: "Logged out" });
  });
}

module.exports = authRoutes;

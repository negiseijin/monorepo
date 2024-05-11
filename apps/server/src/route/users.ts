import { Hono } from "hono";

import { prisma } from "@/lib/prisma";
import type { ResponseUser } from "@repo/schema";

const app = new Hono().get("/", async (c) => {
  const users = await prisma.userInfo.findMany();
  return c.json(users);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  console.log(body);
  const url = `https://jsonplaceholder.typicode.com/users?username=${body.username}`;
  const users: ResponseUser = await fetch(url).then((r) => r.json());
  await new Promise((r) => setTimeout(r, 2000));
  return c.json(users);
});

export default app;

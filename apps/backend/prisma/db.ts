import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../node_modules/.prisma/client";
import "dotenv/config";

// Perhatikan perubahan di sini: bungkus dalam objek { client: libsql }
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./db.sqlite",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma = new PrismaClient({ adapter });
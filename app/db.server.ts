import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment.");
}

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.__db) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    global.__db = new PrismaClient({ adapter });
  }
  prisma = global.__db;
}

export { prisma };
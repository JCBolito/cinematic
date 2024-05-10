import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./src/database/schema.ts",
  driver: "pg",
  out: "./src/drizzle",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
    password: process.env.POSTGRES_PASSWORD!,
    host: process.env.POSTGRES_HOST!,
    database: process.env.POSTGRES_DATABASE!,
    ssl: true,
    user: process.env.POSTGRES_USER,
  },
} satisfies Config;

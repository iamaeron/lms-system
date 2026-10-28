import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// import { relations } from "./relations";
import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw Error("Please add your DATABASE_URL in the .env first!");

export const pool = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle({ client: pool });

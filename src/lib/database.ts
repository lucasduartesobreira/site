import { Client, createClient } from "@libsql/client";

let database: Client | null = null;

export const dbClient = () => {
  if (database == null) {
    const url = process.env.DATABASE_URL ?? "file:data/local.db";
    database = createClient({
      url: url,
      authToken: process.env.AUTH_JWT_KEY,
    });
  }

  return database;
};

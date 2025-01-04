import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/app/api/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
});
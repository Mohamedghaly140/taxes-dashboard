const required = ["DATABASE_URL", "DIRECT_URL"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  DIRECT_URL: process.env.DIRECT_URL as string,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

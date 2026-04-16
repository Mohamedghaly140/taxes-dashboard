// Edge-safe — no Prisma or Node.js imports
export const SESSION_COOKIE_NAME = "auth_session";

export const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

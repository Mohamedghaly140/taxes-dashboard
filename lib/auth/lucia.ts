import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";
import type { Role, Status } from "@/generated/prisma/enums";

const adapter = new PrismaAdapter(prisma.session, prisma.user);


export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => ({
    name: attributes.name,
    email: attributes.email,
    role: attributes.role,
    status: attributes.status,
  }),
});

interface DatabaseUserAttributes {
  name: string;
  email: string;
  role: Role;
  status: Status;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}


import type { Role, Status } from "@/generated/prisma/client";

export type UserWithCount = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: Date;
  _count: { customers: number };
};

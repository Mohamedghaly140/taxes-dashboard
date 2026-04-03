import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CLIENT", "ADMIN"], { message: "Role is required" }),
  status: z.enum(["ACTIVE", "INACTIVE"], { message: "Status is required" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").or(z.literal("")),
  role: z.enum(["CLIENT", "ADMIN"], { message: "Role is required" }),
  status: z.enum(["ACTIVE", "INACTIVE"], { message: "Status is required" }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").or(z.literal("")).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

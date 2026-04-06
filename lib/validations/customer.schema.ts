import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  emailPassword: z.string().min(1, "Email password is required"),
  username: z.string().min(1, "Username is required"),
  portalPassword: z.string().min(1, "Portal password is required"),
  fileNumber: z.string().min(1, "File number is required"),
  taxRegistrationNumber: z.string().regex(/^\d{3}-\d{3}-\d{3}$/, "Must be in format 000-000-000"),
  nationalId: z.string().length(14, "Must be 14 digits"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

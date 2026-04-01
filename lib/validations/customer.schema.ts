import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  emailPassword: z.string().min(1, "Email password is required"),
  username: z.string().min(1, "Username is required"),
  portalPassword: z.string().min(1, "Portal password is required"),
  fileNumber: z.string().min(1, "File number is required"),
  taxRegistrationNumber: z.string().length(9, "Must be 9 digits"),
  nationalId: z.string().length(14, "Must be 14 digits"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

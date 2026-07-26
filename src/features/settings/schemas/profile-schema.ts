import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9._-]+$/),
  email: z.string().trim().email().max(120),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

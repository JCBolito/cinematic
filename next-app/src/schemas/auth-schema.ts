import { z } from "zod";

export const signUpFormSchema = z
  .object({
    firstName: z.string().max(128),
    lastName: z.string().max(128),
    username: z.string().min(1).max(128),
    confirmUsername: z.string().min(1).max(128),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.confirmUsername === data.username, {
    message: "Usernames do not match",
    path: ["confirmUsername"],
  });

export const loginFormSchema = z.object({
  username: z.string().max(128),
  password: z.string(),
});

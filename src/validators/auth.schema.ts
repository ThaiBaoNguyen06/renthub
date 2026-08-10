import { z } from "zod";
export const registerSchema = z.object({
    fullName: z.string().trim().min(2, "Full name must contain at least 2 characters").max(120, "Full name must not exceed 120 characters"),
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    phone: z.string().trim().min(8, "Phone number is too short").max(20, "Phone number is too long").optional().or(z.literal("")),
    role: z.enum(["client", "host", "agent"]),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
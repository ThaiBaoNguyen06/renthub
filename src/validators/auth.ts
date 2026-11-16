import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Tên phải có ít nhất 2 ký tự").max(100, "Tên quá dài"),
  // Trim and lowercase first, then check the email format.
  email: z.string().trim().toLowerCase().pipe(z.email("Email không hợp lệ")),
  // Optional; if given, 10 digits starting with 0.
  phone: z.string().trim().regex(/^(0\d{9})?$/, "Số điện thoại không hợp lệ"),
  // bcrypt only uses the first 72 bytes of a password.
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(72, "Mật khẩu quá dài"),
  // Self-registration: host or client only. "admin"/"agent" are rejected here.
  role: z.enum(["host", "client"], "Vai trò không hợp lệ"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

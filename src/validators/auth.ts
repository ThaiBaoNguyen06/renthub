import {z} from "zod";
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Tên phải có ít nhất 2 ký tự").max(100, "Tên quá dài"),
  email: z.string().trim().toLowerCase().pipe(z.email("Email không hợp lệ")),
  phone: z.string().trim().regex(/^(0\d{9})?$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(72, "Mật khẩu quá dài"),
  role: z.enum(["host", "client"], "Vai trò không hợp lệ"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
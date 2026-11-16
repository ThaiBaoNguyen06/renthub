"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "@/validators/auth";
import { registerUser } from "@/services/user-service";

export type RegisterState = {
  errors?: Partial<Record<string, string[]>>;
  // What the user typed, sent back so the form isn't wiped on error (never the password).
  values?: Partial<Record<"name" | "email" | "phone" | "role", string>>;
};

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const raw = Object.fromEntries(formData);
  const values = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    role: String(raw.role ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const result = await registerUser(parsed.data);
  if (!result.ok) {
    return { errors: { email: ["Email này đã được sử dụng"] }, values };
  }

  redirect("/dang-nhap?registered=1"); // trang đăng nhập sẽ làm ở bước 4
}
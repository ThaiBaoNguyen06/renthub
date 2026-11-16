"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "@/validators/auth";
import { registerUser } from "@/services/user-service";

export type RegisterState = {
  errors?: Partial<Record<string, string[]>>;
};

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await registerUser(parsed.data);
  if (!result.ok) {
    return { errors: { email: ["Email này đã được sử dụng"] } };
  }

  redirect("/dang-nhap?registered=1"); // trang đăng nhập sẽ làm ở bước 4
}

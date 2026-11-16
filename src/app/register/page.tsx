import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Đăng ký | RentHub",
  robots: { index: false }, // trang tài khoản không cần lên Google
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
      <RegisterForm />
    </main>
  );
}

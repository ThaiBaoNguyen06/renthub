"use client"; // cần useActionState, một hook chạy trên trình duyệt

import { useActionState } from "react";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const err = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <Field label="Họ tên" name="name" error={err("name")} />
      <Field label="Email" name="email" type="email" error={err("email")} />
      <Field label="Số điện thoại (không bắt buộc)" name="phone" type="tel" error={err("phone")} />
      <Field label="Mật khẩu" name="password" type="password" error={err("password")} />

      <fieldset>
        <legend className="text-sm font-medium">Bạn là</legend>
        <label className="mr-4"><input type="radio" name="role" value="client" defaultChecked /> Người thuê</label>
        <label><input type="radio" name="role" value="host" /> Chủ nhà</label>
        {err("role") && <p className="text-sm text-red-600">{err("role")}</p>}
      </fieldset>

      <button disabled={pending} className="w-full rounded bg-teal-700 py-2 text-white disabled:opacity-50">
        {pending ? "Đang tạo tài khoản..." : "Đăng ký"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", error }: {
  label: string; name: string; type?: string; error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      <input id={name} name={name} type={type} className="mt-1 w-full rounded border px-3 py-2" />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

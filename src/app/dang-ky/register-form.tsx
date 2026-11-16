"use client"; // cần useActionState, một hook chạy trên trình duyệt

import { useActionState } from "react";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const err = (field: string) => state.errors?.[field]?.[0];
  const v = state.values ?? {};
  const isHost = v.role === "host";

  return (
    // React 19 resets the form after an action; the reset restores defaultValue,
    // so the values sent back by the action reappear.
    <form action={formAction} className="mt-6 space-y-4">
      <Field label="Họ tên" name="name" defaultValue={v.name} error={err("name")} />
      <Field label="Email" name="email" type="email" defaultValue={v.email} error={err("email")} />
      <Field label="Số điện thoại (không bắt buộc)" name="phone" type="tel" defaultValue={v.phone} error={err("phone")} />
      <Field label="Mật khẩu" name="password" type="password" error={err("password")} />

      <fieldset>
        <legend className="text-sm font-medium">Bạn là</legend>
        <label className="mr-4"><input type="radio" name="role" value="client" defaultChecked={!isHost} /> Người thuê</label>
        <label><input type="radio" name="role" value="host" defaultChecked={isHost} /> Chủ nhà</label>
        {err("role") && <p className="text-sm text-red-600">{err("role")}</p>}
      </fieldset>

      <button disabled={pending} className="w-full rounded bg-brand py-2 font-semibold text-white hover:bg-brand-hover disabled:opacity-50">
        {pending ? "Đang tạo tài khoản..." : "Đăng ký"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", defaultValue, error }: {
  label: string; name: string; type?: string; defaultValue?: string; error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-1 w-full rounded border border-line px-3 py-2"
      />
      {error && <p id={`${name}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
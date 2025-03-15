"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "../../app/register/actions";
import Link from "next/link";

export function RegisterForm() {
  const [state, registerAction] = useActionState(register, undefined);

  return (
    <form action={registerAction} className="flex max-w-[300px] flex-col gap-3 h-screen justify-center items-center mx-auto">
      <div className="flex flex-col gap-2">
        <input
          id="email"
          name="email"
          placeholder="Введите email..."
          className="px-2 py-1 rounded-sm border border-white"
        />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500 break-words">{state.errors.email}</p>
      )}

      <div className="flex flex-col gap-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Введите пароль..."
          className="px-2 py-1 rounded-sm border border-white"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500 break-words">{state.errors.password}</p>
      )}
      <SubmitButton />
      <p>Есть аккаунт ? <Link className="text-blue-600 underline" href="/login">Войти</Link></p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="bg-green-500 px-2 py-1 rounded-sm cursor-pointer  disabled:bg-gray-400"
      disabled={pending} type="submit">
      {pending ? 'Подождите...' : 'Регистрация'}
    </button>
  );
}
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "../../app/login/actions";
import Link from "next/link";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);
  const { pending } = useFormStatus();

  return (
    <form action={loginAction} className="justify-start pt-10 md:justify-center flex max-w-[300px] flex-col gap-5 h-screen items-center mx-auto">
      <h1 className="text-3xl font-bold uppercase text-slate-400/85">crm</h1>
      <div className="flex flex-col gap-2 w-full">
        <input
          id="email"
          name="email"
          placeholder="Введите email..."
          className="px-4 py-2 rounded-sm border border-white text-md"
        />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500 break-words">{state.errors.email}</p>
      )}

      <div className="flex flex-col gap-2 w-full">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Введите пароль..."
          className="px-4 py-2 rounded-sm border border-white text-md"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500 break-words">{state.errors.password}</p>
      )}
      <SubmitButton isPending={pending} isPendingText="Подождите..." text="Войти" />

      <p className="self-start">Нет аккаунта ? <Link className="text-blue-600 underline text-lg font-bold ml-2" href="/register">Регистрация</Link></p>
    </form>
  );
}

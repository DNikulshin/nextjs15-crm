"use client";

import { useActionState } from "react";
import { register } from "../../app/register/actions";
import Link from "next/link";
import { SubmitButton } from "./SubmitButton";

export function RegisterForm() {
  const [state, registerAction] = useActionState(register, undefined);
 

  return (
    <form action={registerAction} className="justify-start pt-10 md:justify-center flex max-w-[300px] flex-col gap-5 h-screen items-center mx-auto">
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
          className="px-4 py-2 rounded-sm border border-white  text-md"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500 break-words">{state.errors.password}</p>
      )}
      <SubmitButton isPendingText="Подождите..." text="Регистрация" />
      <p className="self-start">Есть аккаунт ? <Link className="text-blue-600 underline text-lg font-bold ml-2" href="/login">Войти</Link></p>
    </form>
  );
}

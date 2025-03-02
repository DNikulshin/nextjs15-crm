"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "../app/login/actions";
import Link from "next/link";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form action={loginAction} className="flex max-w-[300px] flex-col gap-3 h-screen justify-center items-center mx-auto">
      <div className="flex flex-col gap-2">
        <input id="email" name="email" placeholder="Email" className="px-2 py-1 rounded-sm" />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

      <div className="flex flex-col gap-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="px-2 py-1 rounded-sm"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}
      <SubmitButton />

      <p>Not Account ? <Link className="text-blue-600 underline" href="/register">Register</Link></p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="bg-green-500 px-2 py-1 rounded-sm cursor-pointer"
      disabled={pending} type="submit">
      Login
    </button>
  );
}

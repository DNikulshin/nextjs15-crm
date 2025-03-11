"use server";

import { z } from "zod";
import { createSession, deleteSession, getSessionUser, SessionPayload } from "@/shared/lib/session";
import { redirect } from "next/navigation";
import { prismaClient } from "@/prismaClient"
import { compare } from "bcrypt";

const loginSchema = z.object({
  email: z.string().email({ message: "Некорректный email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Пароль должен быть не менее 8 символов" })
    .trim(),
});


export async function login(prevState: unknown, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      errors: {
        email: ["Неверный email или пароль"],
      },
    };
  }

  const comparePassword = await compare(password, user.passwordHash);

  if (!comparePassword) {
    return {
      errors: {
        email: ["Неверный email или пароль"],
      },
    };
  }

  await createSession(user.id, user.email);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}


export async function getUser(): Promise<SessionPayload | undefined> {
  return await getSessionUser() as SessionPayload
}
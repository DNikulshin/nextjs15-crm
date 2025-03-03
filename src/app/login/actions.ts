"use server";

import { z } from "zod";
import { createSession, deleteSession, getSessionUserId } from "@/shared/lib/session";
import { redirect } from "next/navigation";
import { prismaClient } from "@/prismaClient"
import { compare } from "bcrypt";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
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
        email: ["Invalid email or password"],
      },
    };
  }

  const comparePassword = await compare(password, user.passwordHash);

  if (!comparePassword) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(user.id);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}


export async function getUserId(): Promise<string> {
  return await getSessionUserId() as string
}
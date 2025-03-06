"use server";

import { z } from "zod";
import { createSession } from "@/shared/lib/session";
import { redirect } from "next/navigation";
import { prismaClient } from "@/prismaClient"
import { hash } from "bcrypt";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function register(prevState: unknown, formData: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;


  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  });


  if (existingUser) {
    return {
      errors: {
        email: ["Email already in use"],
      },
    };
  }

  const passwordHash = await hash(password, 10);

  const user = await prismaClient.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  await createSession(user.id, user.email);

  redirect("/");
}

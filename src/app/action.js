"use server";
import { cookies } from "next/headers";

export async function create(data) {
  const thirtyDay = 24 * 60 * 60 * 1000 * 30;

  cookies().set({
    name: "access_token",
    value: data,
    httpOnly: false,
    secure: true,
    path: "/",
    expires: Date.now() + thirtyDay,
  });
}

export async function createRoleCookie(data) {
  cookies().set({
    name: "role",
    value: data,
    httpOnly: false,
    secure: true,
    path: "/",
  });
}

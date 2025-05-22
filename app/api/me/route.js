// app/api/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  // Чекаємо на cookies()
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");

  if (!cookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = JSON.parse(cookie.value);

  return NextResponse.json({ user }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { auth, ADMIN_EMAILS } from "@/auth";
import { kv } from "@vercel/kv";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const value = await kv.get<string>(`content:${key}`);
  return NextResponse.json({ value: value ?? null });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { key, value } = await request.json();
  if (!key || typeof value !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await kv.set(`content:${key}`, value);
  return NextResponse.json({ success: true });
}

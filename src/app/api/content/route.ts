import { NextRequest, NextResponse } from "next/server";
import { auth, ADMIN_EMAIL } from "@/auth";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "content-overrides.json");

async function readOverrides(): Promise<Record<string, string>> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeOverrides(overrides: Record<string, string>) {
  await fs.writeFile(DATA_FILE, JSON.stringify(overrides, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const overrides = await readOverrides();
  return NextResponse.json({ value: overrides[key] ?? null });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { key, value } = await request.json();
  if (!key || typeof value !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const overrides = await readOverrides();
  overrides[key] = value;
  await writeOverrides(overrides);

  return NextResponse.json({ success: true });
}

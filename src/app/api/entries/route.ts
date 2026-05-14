import { NextRequest, NextResponse } from "next/server";
import { auth, ADMIN_EMAILS } from "@/auth";
import Redis from "ioredis";

function getRedis() {
  return new Redis(process.env.REDIS_URL!);
}

// GET: List all custom entry IDs
export async function GET() {
  const redis = getRedis();
  try {
    const ids = await redis.lrange("custom-entries", 0, -1);
    const entries = await Promise.all(
      ids.map(async (id) => {
        const data = await redis.hgetall(`entry:${id}`);
        return { id, ...data };
      })
    );
    return NextResponse.json({ entries });
  } finally {
    redis.disconnect();
  }
}

// POST: Create a new custom entry
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id: providedId, src, year, volume, issue, caption } = await request.json();
  if (!src || !year || !volume || !issue || !caption) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const id = providedId || `custom-${Date.now()}`;
  const redis = getRedis();
  try {
    await redis.hset(`entry:${id}`, { src, year, volume, issue, caption });
    // Only push to list if it's a new entry (not already in the list)
    const exists = await redis.lpos("custom-entries", id);
    if (exists === null) {
      await redis.rpush("custom-entries", id);
    }
    return NextResponse.json({ success: true, id });
  } finally {
    redis.disconnect();
  }
}

// DELETE: Remove a custom entry
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const redis = getRedis();
  try {
    await redis.lrem("custom-entries", 0, id);
    await redis.del(`entry:${id}`);
    return NextResponse.json({ success: true });
  } finally {
    redis.disconnect();
  }
}

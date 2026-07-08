import { NextResponse } from "next/server";
import { prisma } from "@/shared/db/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: { database: "ok", app: "ok" },
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: { database: "error", app: "ok" },
      },
      { status: 503 },
    );
  }
}

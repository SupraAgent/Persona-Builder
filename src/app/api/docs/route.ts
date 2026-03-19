import { NextRequest, NextResponse } from "next/server";
import { listDocs } from "@/lib/docs-api";

export async function GET(request: NextRequest) {
  try {
    const dir = request.nextUrl.searchParams.get("dir") || "";
    const docs = await listDocs(dir);
    return NextResponse.json({ docs });
  } catch (err) {
    console.error("[api/docs] GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

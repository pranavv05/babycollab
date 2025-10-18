import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, sessionId, orgId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  return NextResponse.json({
    userId,
    sessionId,
    orgId,
    message: "Successfully authenticated"
  });
}
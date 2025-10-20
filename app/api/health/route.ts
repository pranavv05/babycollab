import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Test if we can query the user table (if it exists)
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
    } catch (e) {
      // Table might not exist yet, which is fine
      console.log("User table not found or empty");
    }
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      userCount: userCount
    })
  } catch (error) {
    console.error("Health check failed:", error)
    
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
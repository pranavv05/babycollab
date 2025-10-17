import { NextResponse } from "next/server"
import { getProjectById } from "@/lib/projects-store"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const project = await getProjectById(params.id)
    if (!project) return NextResponse.json({ error: "not found" }, { status: 404 })
    return NextResponse.json(project)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

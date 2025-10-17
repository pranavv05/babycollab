import { NextResponse } from "next/server"
import { getProjects, createProject } from "@/lib/projects-store"

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "title and description required" }, { status: 400 })
    }

    // Accept files as data URLs in body.files: [{name,type,size,dataUrl}]
    const files = Array.isArray(body.files)
      ? body.files
          .map((f: any) => ({ name: f.name, type: f.type, size: Number(f.size) || 0, url: f.dataUrl }))
          // limit size to 5MB per file for in-memory storage
          .filter((f: any) => f.size > 0 && f.size <= 5 * 1024 * 1024)
      : []

    const project = await createProject({
      title: body.title,
      description: body.description,
      fullDescription: body.fullDescription,
      skills: Array.isArray(body.skills) ? body.skills : (body.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      teamSize: body.teamSize,
      dueDate: body.dueDate,
      openPositions: Number(body.openPositions) || 0,
      goals: body.goals || [],
      files,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

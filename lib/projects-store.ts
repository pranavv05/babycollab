export interface Project {
  id: string
  title: string
  description: string
  fullDescription?: string
  status?: string
  statusColor?: string
  isMember?: boolean
  admin?: { name: string; avatar?: string }
  members?: Array<{ name: string; avatar?: string }>
  tasks?: { todo: number; inProgress: number; done: number }
  dueDate?: string
  createdAt: string
  skills?: string[]
  teamSize?: number | string
  openPositions?: number
  goals?: string[]
  files?: Array<{ name: string; size: number; type?: string; url?: string }>
}

// Simple in-memory store. This persists only while the server process is running
// (suitable for local dev). For production you should use a proper database
// (Supabase, Postgres, MongoDB, Vercel KV, etc.).
import prisma from "./db"

// keep an in-memory fallback for when DATABASE_URL isn't configured
const projectsCache: Project[] = []

export async function getProjects(): Promise<Project[]> {
  if (process.env.DATABASE_URL) {
    const rows = await prisma.project.findMany({ include: { files: true } })
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      fullDescription: r.fullDescription,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      dueDate: r.dueDate ? r.dueDate.toISOString() : undefined,
      skills: r.skills || [],
      members: JSON.parse(r.members || "[]"),
      tasks: JSON.parse(r.tasks || "{}"),
      teamSize: r.teamSize,
      openPositions: r.openPositions,
      goals: r.goals || [],
      files: (r.files || []).map((f: any) => ({ name: f.name, url: f.url, size: f.size, type: f.type })),
    }))
  }

  return projectsCache
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (process.env.DATABASE_URL) {
    const r = await prisma.project.findUnique({ where: { id }, include: { files: true } })
    if (!r) return undefined
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      fullDescription: r.fullDescription,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      dueDate: r.dueDate ? r.dueDate.toISOString() : undefined,
      skills: r.skills || [],
      members: JSON.parse(r.members || "[]"),
      tasks: JSON.parse(r.tasks || "{}"),
      teamSize: r.teamSize,
      openPositions: r.openPositions,
      goals: r.goals || [],
      files: (r.files || []).map((f: any) => ({ name: f.name, url: f.url, size: f.size, type: f.type })),
    }
  }

  return projectsCache.find((p) => p.id === id)
}

export async function createProject(data: Omit<Project, "id" | "createdAt">): Promise<Project> {
  if (process.env.DATABASE_URL) {
    const created = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        fullDescription: data.fullDescription || data.description,
        status: data.status || "Planning",
        members: JSON.stringify(data.members || []),
        tasks: JSON.stringify(data.tasks || { todo: 0, inProgress: 0, done: 0 }),
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        skills: data.skills || [],
        teamSize: typeof data.teamSize === 'number' ? data.teamSize : parseInt(String(data.teamSize || '1')),
        openPositions: data.openPositions || 0,
        goals: data.goals || [],
      },
    })

    // create files if provided
    if (data.files && data.files.length > 0) {
      for (const f of data.files) {
        await prisma.projectFile.create({
          data: {
            name: f.name,
            url: f.url || '',
            size: f.size || 0,
            type: f.type || '',
            projectId: created.id,
          },
        })
      }
    }

    return getProjectById(created.id) as Promise<Project>
  }

  const id = Date.now().toString()
  const createdAt = new Date().toISOString()
  const project: Project = {
    id,
    createdAt,
    title: data.title,
    description: data.description,
    fullDescription: data.fullDescription || data.description,
    status: data.status || "Planning",
    statusColor: data.statusColor || "text-muted-foreground",
    isMember: !!data.isMember,
    admin: data.admin || { name: "You", avatar: "YY" },
    members: data.members || [],
    tasks: data.tasks || { todo: 0, inProgress: 0, done: 0 },
    dueDate: data.dueDate,
    skills: data.skills || [],
    teamSize: data.teamSize || 1,
    openPositions: data.openPositions || 0,
    goals: data.goals || [],
    files: data.files || [],
  }

  projectsCache.unshift(project)
  return project
}

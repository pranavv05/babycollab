import { Metadata } from 'next'
import getPrismaClient from '@/lib/db'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  if (!id) {
    return {
      title: 'Project Not Found',
    }
  }

  try {
    const prisma = await getPrismaClient()
    const project = await prisma.project.findUnique({
      where: { id },
      select: { title: true, description: true }
    })

    if (!project) {
      return {
        title: 'Project Not Found',
      }
    }

    return {
      title: `${project.title} | Baby Collab`,
      description: project.description || `View details for project ${project.title} on Baby Collab.`,
      openGraph: {
        title: project.title,
        description: project.description || `View details for project ${project.title} on Baby Collab.`,
      }
    }
  } catch (error) {
    console.error('Error fetching project metadata:', error)
    return {
      title: 'Project Details | Baby Collab',
    }
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

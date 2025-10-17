import { PrismaClient } from '@prisma/client'

declare global {
  // allow global var in dev to prevent multiple clients
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined
}

const getPrisma = (): PrismaClient => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set. Prisma client will still initialize but DB calls will fail until configured.')
  }

  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  }

  if (!global.__prismaClient) {
    global.__prismaClient = new PrismaClient()
  }
  return global.__prismaClient
}

export const prisma = getPrisma()

export default prisma

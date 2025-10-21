import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

declare global {
  // allow global var in dev to prevent multiple clients
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined
}

const getPrisma = async (): Promise<PrismaClient> => {
  // Check if we have Turso database credentials
  const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  // Always use Turso for both development and production
  if (tursoDatabaseUrl && tursoAuthToken) {
    try {
      const adapter = new PrismaLibSQL({
        url: tursoDatabaseUrl,
        authToken: tursoAuthToken,
      });
      return new PrismaClient({ adapter });
    } catch (error) {
      console.error('Failed to initialize Turso client:', error);
      throw error;
    }
  }

  throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
}

// Create a singleton instance
let prismaClient: PrismaClient | undefined;

export const getPrismaClient = async (): Promise<PrismaClient> => {
  if (!prismaClient) {
    prismaClient = await getPrisma();
  }
  return prismaClient;
}

export default getPrismaClient
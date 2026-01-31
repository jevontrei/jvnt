import { PrismaClient } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new pg.Pool({
  connectionString: process.env.NAS_DATABASE_URL,
});

// DAYUM! i was initially following this: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
// but prisma changed and this was documented badly:  https://github.com/prisma/prisma/issues/28670
// so we need an adapter, which we need to pass to PrismaClient()

const adapter = new PrismaPg(pool);

// named export -- must import with exact name
// ?? is the nullish coalescing operator
// ?? returns the first defined (non-nullish) value, while || returns the first truthy value
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

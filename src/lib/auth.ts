import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma-neon";

// note: better auth automatically signs you in on registration, unless you have email verification on, in which case you can optionally set autoSignInAfterVerification: true

// named export -- must import with exact name
export const auth = betterAuth({
  // need to do all the prisma/db setup first, before we set up better auth, so that better auth knows what we're using and what tables to generate etc
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // optional; default is 8
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

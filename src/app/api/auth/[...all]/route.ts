import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// named export -- must import with exact name
export const { POST, GET } = toNextJsHandler(auth);

// this route.ts file lives /api/auth/[...all]

// better-auth will create many endpoints for you, like:
// /api/auth/sign-in
// /api/auth/sign-up
// /api/auth/get-session

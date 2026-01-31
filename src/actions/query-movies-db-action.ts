"use server";

import { prisma } from "@/lib/prisma-neon";
import { Movie } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
import { notifyDiscord } from "./notify-discord-action";

type DbQuerySuccessType = {
  error: null;
  data: Movie[];
};

type DbQueryErrorType = {
  error: string;
  data: null;
};

type DbQueryType = DbQuerySuccessType | DbQueryErrorType;

export async function QueryMoviesDbAction(): Promise<DbQueryType> {
  try {
    const dbResponse = await prisma.movie.findMany();

    await notifyDiscord(`Movies db queried: ${dbResponse.length} movies found`);

    // return data to browser
    return {
      error: null,
      data: dbResponse,
    };
  } catch (err) {
    console.log("Error in database fetching:", err);
    return { error: String(err), data: null };
  }
}

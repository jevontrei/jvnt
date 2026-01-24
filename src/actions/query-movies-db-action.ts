"use server";

import { prisma } from "@/lib/prisma";
import { Movie } from "@/generated/prisma/client";

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
    console.log("dbResponse:", dbResponse);

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

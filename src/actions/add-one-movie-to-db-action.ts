"use server";

import { prisma } from "@/lib/prisma-neon";
import { notifyDiscord } from "./notify-discord-action";
import { Prisma } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
import { TmdbMovieDataType } from "./call-tmdb-api-action";

export type DbActionSuccessType = {
  error: null;
  data: TmdbMovieDataType;
};
export type DbActionErrorType = {
  error: string;
  data: null;
};
export type DbActionResultType = DbActionSuccessType | DbActionErrorType;

// TODO: handle when user enters crazy string -> timeout

// Promise here is a generic type; <ActionResultType> is a generic type argument
export async function AddOneMovieToDbAction(
  inputData: TmdbMovieDataType,
): Promise<DbActionResultType> {
  try {
    const { title, release_date, vote_average } = inputData;

    // is this good practice? idk
    if (!title) {
      return { error: ">> No title found", data: null };
    }

    const movie: TmdbMovieDataType = {
      title: title,
      release_date: release_date,
      vote_average: vote_average,
    };

    // add movie to db
    await prisma.movie.create({ data: movie });

    await notifyDiscord(`Movies added to database: ${movie.title}`);

    // return data to browser
    return { error: null, data: movie };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
      if (err.code === "P2002") {
        return {
          error: "That movie is already in my bleedin' database!",
          data: null,
        };
      }
    } else if (err instanceof Error) {
      if (err.message.includes("...")) {
        return {
          error:
            // TODO: finish this
            ">> ... meaningful msg here...",
          data: null,
        };
      }
    }

    // fallback for unknown error (without details)... see log for details
    return { error: `Unexpected error occurred: ${err}`, data: null };
  }
}

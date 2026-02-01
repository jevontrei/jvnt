"use server";

// do i even need to write "use server"?

import { prisma } from "@/lib/prisma-neon";
import { notifyDiscord } from "./notify-discord-action";
import { Prisma } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
import { CallTmdbApiAction } from "./call-tmdb-api-action";
import {
  TmdbMovieDataType,
  TmdbActionResultType,
} from "./call-tmdb-api-action";

// TODO: handle when user enters crazy string -> timeout

// Promise here is a generic type; <ActionResultType> is a generic type argument
export async function SearchMoviesAction(
  inputData: FormData,
): Promise<TmdbActionResultType> {
  try {
    const title = String(inputData.get("title"));

    // validate
    if (!title) {
      console.log(">> Title error...");
      return {
        error: "Please enter your title",
        data: null,
      };
    }

    const { error, data } = await CallTmdbApiAction(title);

    // is this good practice? idk
    if (!data) {
      return { error: error, data: null };
    }

    const movie: TmdbMovieDataType = {
      title: data["title"],
      watched: data["watched"],
      release_date: data["release_date"],
      vote_average: data["vote_average"],
    };

    // add movie to db
    await prisma.movie.create({ data: movie });

    await notifyDiscord(`Movies API called and db updated: ${movie.title}`);

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

"use server";

// do i even need to write "use server"?

import { notifyDiscord } from "./notify-discord-action";
import { CallTmdbApiAction } from "./call-tmdb-api-action";
import { TmdbActionResultType } from "./call-tmdb-api-action";

// TODO: handle when user enters crazy string -> timeout

// Promise here is a generic type; <ActionResultType> is a generic type argument
export async function FindMoviesAction(
  inputData: FormData,
): Promise<TmdbActionResultType> {
  try {
    const title = String(inputData.get("title"));

    // validate
    if (!title) {
      // TODO: this is triggering... understand why and rewrite it
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

    const movies = data.map((movie) => ({
      title: movie["title"],
      release_date: movie["release_date"],
      vote_average: movie["vote_average"],
    }));
    // console.log("movies: ", movies);

    await notifyDiscord(`TMDb API called, found: ${data.length} movies`);

    // return data to browser
    return { error: null, data: movies };
  } catch (err) {
    if (err instanceof Error) {
      // TODO
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

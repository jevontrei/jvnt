"use server";

// do i even need to write "use server"?

import { prisma } from "@/lib/prisma-neon";
import { notifyDiscord } from "./notify-discord-action";
import { Prisma } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)

// define types for the return value of this action; to prevent annoying typescript complaints in search-forecast-form.tsx
// type export -- must import with exact name
// TODO: don't do this; just grab the schema's type that already exists
export type MovieDataType = {
  title: string;
  watched: boolean;
  liked: boolean;
  vote_average: number;
  release_date: string;
};

// i find this pattern of types very cool... much better than what i had before, e.g. `error: string | null`
type ActionSuccessType = {
  error: null;
  data: MovieDataType;
};

type ActionErrorType = {
  error: string;
  data: null;
};

// the ~pipe here ("|") is typescript union type? not a normal OR operator
type ActionResultType = ActionSuccessType | ActionErrorType;

// TODO: handle when user enters crazy string -> timeout

// Promise here is a generic type; <ActionResultType> is a generic type argument
export async function SearchMoviesAction(
  formData: FormData,
): Promise<ActionResultType> {
  try {
    // get form inputs
    // for more robust validation, could use zod or valibot
    const title = String(formData.get("title"));

    // validate
    if (!title) {
      console.log(">> Title error...");
      return {
        error: "Please enter your title",
        data: null,
      };
    }

    // make API request
    // https://developer.themoviedb.org/reference/search-movie
    const titleForUrl = encodeURIComponent(title); // this changes spaces to %20 etc
    const url = `https://api.themoviedb.org/3/search/movie?query=${titleForUrl}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const json = await response.json();
    const result = json["results"][0];
    // console.log(Object.keys(json));
    // console.log(json);
    // console.log(result["title"]);

    const movie: MovieDataType = {
      title: result["title"],
      watched: result["watched"],
      liked: result["liked"],
      release_date: result["release_date"],
      vote_average: result["vote_average"],
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

    // fallback for unknown error (without details... see log for details)
    return { error: `Unexpected error occurred: ${err}`, data: null };
  }
}

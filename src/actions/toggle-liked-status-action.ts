"use server";

import { prisma } from "@/lib/prisma-neon";
import { Movie } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
import { notifyDiscord } from "./notify-discord-action";

type ToggleStatusSuccessType = {
  error: null;
  // what should this be?
  data: Movie;
};

type ToggleStatusErrorType = {
  error: string;
  data: null;
};

type ToggleStatusType = ToggleStatusSuccessType | ToggleStatusErrorType;

export async function ToggleLikedStatusAction(
  movieId: string,
): Promise<ToggleStatusType> {
  try {
    // first, get movie from db (we need access to its liked status)
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });

    // need this for race conditions etc
    if (!movie) {
      return { error: `Movie with id ${movieId} not found`, data: null };
    }

    // then update movie in db
    // in case you're wondering, yes this returns the whole movie object
    const dbResponse = await prisma.movie.update({
      where: { id: movieId },
      data: { liked: !movie.liked },
    });

    await notifyDiscord(
      // this logic looks backwards but it's because we're flipping the EXISTING status
      `Movie liked status updated: ${movie.title} is ${!movie.liked ? "liked" : "not liked"}`,
    );

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

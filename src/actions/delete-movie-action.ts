"use server";

import { prisma } from "@/lib/prisma-neon";
import { Movie } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
import { notifyDiscord } from "./notify-discord-action";

type DeleteMovieSuccessType = {
  error: null;
  // what should this be? -> it should be Movie, bc the prisma.delete() function returns THE DELETED MOVIE OBJECT!
  data: Movie;
};

type DeleteMovieErrorType = {
  error: string;
  data: null;
};

type DeleteMovieType = DeleteMovieSuccessType | DeleteMovieErrorType;

export async function DeleteMovieAction(
  movieId: string,
): Promise<DeleteMovieType> {
  try {
    // first, get movie from db (we need access to the current db situation)
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });

    // need this for race conditions etc
    if (!movie) {
      return { error: `Movie with id ${movieId} not found`, data: null };
    }

    // then delete movie from db
    // what exactly does this return?? ohh it returns the deleted movie object
    const dbResponse = await prisma.movie.delete({
      where: { id: movieId },
    });

    await notifyDiscord(`Movie deleted: ${dbResponse.title}`);

    // return data to browser
    return {
      error: null,
      data: dbResponse,
    };
  } catch (err) {
    console.log("Error in database fetching/deleting:", err);
    return { error: String(err), data: null };
  }
}

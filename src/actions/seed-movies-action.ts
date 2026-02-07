"use server";

import seedData from "@/seed-movies.json" assert { type: "json" };
import { prisma } from "@/lib/prisma-neon";
import { TmdbMovieDataType, CallTmdbApiAction } from "./call-tmdb-api-action";

type SeedActionSuccessType = {
  error: null;
  // createMany() just returns a count
  count: number;
};

type SeedActionErrorType = {
  error: string;
  count: null;
};

type SeedActionResultType = SeedActionSuccessType | SeedActionErrorType;

export type SeedJsonType = {
  title: string;
  rating: number;
};

type MovieWithRating = TmdbMovieDataType & { rating: number; watched: boolean };

export async function SeedMoviesAction(): Promise<SeedActionResultType> {
  try {
    // search ALL seed movies in TMDb
    // need to keep track of seed id to keep MY ratings of seed movie titles paired with the tmdb search results
    const movies: MovieWithRating[] = [];
    // if this is too slow, can try using Promise.all()
    for (const movie of seedData) {
      if (!movie.title) {
        // could rating here possibly be missing? try it - try seeding with a missing rating
        console.log(`Skipping movie with no title and rating: ${movie.rating}`);
        continue;
      }
      const result = await CallTmdbApiAction(movie.title);
      if (result.data) {
        movies.push({
          // this just grabs the first result
          title: result.data[0]["title"],
          release_date: result.data[0]["release_date"],
          vote_average: result.data[0]["vote_average"],
          // reunite my rating with the search results
          rating: movie.rating,
          // all seeded movies should have been watched and rated
          watched: movie.watched,
        });
      } else {
        console.log(
          `Failed seeding movie: ${movie.title} - Error: ${result.error}`,
        );
      }
    }

    // add movies to db
    const dbResponse = await prisma.movie.createMany({
      data: movies,
      skipDuplicates: true,
    });

    console.log(`\nSaved ${dbResponse.count} movies to database\n`);

    // return data to browser
    return { error: null, count: dbResponse.count };
  } catch (err) {
    // log full error details for debugging
    // console.log("Error while seeding movies:", err);
    console.log("Error while seeding movies...");

    // TODO: distinguish between json seed file error, API error and db error
    // handle specific error types
    if (err instanceof Error) {
      if (err.message.includes("...")) {
        return {
          error: "...",
          count: null,
        };
      }

      if (err.message.includes("....")) {
        return {
          error: "....",
          count: null,
        };
      }

      // return specific error msg
      return { error: err.message, count: null };
    }

    // fallback for unknown errors (without details)... see logs for details
    return { error: "Unexpected error occurred", count: null };
  }
}

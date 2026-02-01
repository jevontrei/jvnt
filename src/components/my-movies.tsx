"use client";

import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Movie } from "@/generated/prisma/client";
import { DeleteMovieAction } from "@/actions/delete-movie-action";
import { QueryMoviesDbAction } from "@/actions/query-movies-db-action";
import { ToggleWatchedStatusAction } from "@/actions/toggle-watched-status-action";
import { SeedMoviesAction } from "@/actions/seed-movies-action";

// we needed this Record<> type because object keys are usually strings
const ratingColors: Record<number, string> = {
  0: "bg-transparent",
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-lime-500",
  5: "bg-green-500",
  6: "bg-blue-500",
  7: "bg-fuchsia-500",
};

export default function MyMovies() {
  const [myMovies, setMyMovies] = useState<Movie[] | null>(null);
  const [dbIsEmpty, setDbIsEmpty] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // TODO: let user sort movies by any column
  const sortedMovies = useMemo(() => {
    if (!myMovies) return null;

    return [...myMovies].sort((a, b) => {
      // handle null ratings first
      if (a.rating === null) return 1; // send nulls to end
      if (b.rating === null) return -1; // send nulls to end
      // return negative if a should come before b
      // return positive if b should come before a
      // return 0 if equal
      return b.rating - a.rating; // highest rating first
    });
  }, [myMovies]);

  async function handleFetchSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    try {
      toast.info("Querying database...");
      const { error, data } = await QueryMoviesDbAction();

      if (error) {
        console.log("[search-movies-action] Failed to fetch movies:", error);
        toast.error(error);
        return;
      }

      if (!data || data.length === 0) {
        setDbIsEmpty(true);
        toast.info("Database is empty!");
        return;
      }

      // only runs if no error
      toast.success("Bloody oath! Database has been gotted!");
      // TODO: this still doesn't trigger a re-render of the table... when i search a movie, my db does get updated, but the "my movies" table doesn't unless i click "see what's in my db" again
      setMyMovies(data);
    } catch (err) {
      console.log("Error from my-movies.tsx:", err);
      toast.error(`Network error: ${err}`);
    } finally {
      // always re-enable button
      setIsPending(false);
    }
  }

  async function handleSeedSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);
    try {
      toast.info("Seeding database...");
      const { error, count } = await SeedMoviesAction();

      if (error) {
        console.log("[seed-movies-action] Failed to seed movies:", error);
        toast.error(error);
        return;
      }

      if (!count || count === 0) {
        setDbIsEmpty(true);
        toast.info("Database is empty!");
        return;
      }

      // only runs if no error
      toast.success("Wowee! The movies database has been seeded! Now fetch it");

      // now need to re-query db (state will be state therein)
      QueryMoviesDbAction();
    } catch (err) {
      console.log("Error from my-movies.tsx:", err);
      toast.error(`Network error: ${err}`);
    } finally {
      // always re-enable button
      setIsPending(false);
    }
  }
  async function handleToggleWatchedClick(movieId: string) {
    // note: we don't need evt or evt.preventDefault() here because handleToggleWatchedClick is not coming from a form element or link click -- so there's no reload to prevent
    setIsPending(true);

    // TODO: while mark as un/watched buttons are pending and grayed out, they creep over into the table header. looks bad. fix it.

    try {
      toast.info("Thinking...");

      const { error, data } = await ToggleWatchedStatusAction(movieId);

      if (error) {
        console.log(
          "[toggle-watched-status-action] Failed to fetch movies or toggle status:",
          error,
        );
        toast.error(error);
        return;
      }

      // i don't think this would happen, except maybe in a crazy unlucky scenario (?)
      if (!data) {
        setDbIsEmpty(true);
        toast.info("Database is empty!");
        return;
      }

      // only runs if no error
      toast.success("Hell yeah!");

      //  update myMovies with data
      if (!myMovies) return; // early return just to satisfy ts (myMovies won't be null here because of {myMovies && ...} below)
      const updatedMyMovies = myMovies.map((movie) =>
        movie.id === data.id ? data : movie,
      );
      setMyMovies(updatedMyMovies);
    } catch (err) {
      console.log("Error from my-movies.tsx:", err);
      toast.error(`Network error: ${err}`);
    } finally {
      // always re-enable button
      setIsPending(false);
    }
  }

  async function handleDeleteClick(movieId: string) {
    setIsPending(true);

    try {
      toast.info("Thinking...");

      const { error, data } = await DeleteMovieAction(movieId);

      if (error) {
        console.log("[delete-movie-action] Failed to delete movie:", error);
        toast.error(error);
        return;
      }

      // i don't think this would happen, except maybe in a crazy unlucky scenario (?)
      if (!data) {
        setDbIsEmpty(true);
        toast.info("Database is empty!");
        return;
      }

      // only runs if no error
      toast.success("Movie deleted!");

      //  update myMovies with data
      if (!myMovies) return; // early return just to satisfy ts (myMovies won't be null here because of {myMovies && ...} below)
      // need to do this to actually remove the deleted movie from our state and therefore trigger a re-render
      const updatedMyMoviesInclNull = myMovies.map((movie) =>
        movie.id === data.id ? null : movie,
      );
      const updatedMyMovies = updatedMyMoviesInclNull.filter(
        (movie) => movie !== null,
      );
      setMyMovies(updatedMyMovies);
    } catch (err) {
      console.log("Error from my-movies.tsx:", err);
      toast.error(`Network error: ${err}`);
    } finally {
      // always re-enable button
      setIsPending(false);
    }
  }

  return (
    <div className="my-8 mx-4 flex flex-col items-center space-y-2">
      <div className="flex flex-row space-x-4">
        <form onSubmit={handleFetchSubmit} className="mb-0">
          <Button className="w-48" disabled={isPending}>
            Fetch database
          </Button>
        </form>

        <form onSubmit={handleSeedSubmit} className="mb-0">
          <Button className="w-48" disabled={isPending}>
            Seed database
          </Button>
        </form>
      </div>

      {dbIsEmpty && (
        <div className="my-2 px-4 py-2 bg-pink-200 rounded-md">
          Looks like the database is empty! Better go fetch some bloody movies
          cobber!
        </div>
      )}

      {sortedMovies && (
        <div className="mt-2 max-h-96 overflow-x-auto overflow-y-auto border rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="text-left">Movie</th>
                <th className="text-left">Joel watched</th>
                <th className="text-left">Joel&apos;s rating</th>
                {/* <th className="text-left">Added by</th> */}
                <th className="text-left"></th>
              </tr>
            </thead>
            <tbody>
              {sortedMovies.map((movie) => (
                <tr key={movie.id} className="even:bg-gray-50">
                  <td>{movie.title}</td>

                  {/* TODO: add release_date (AND POSTER) to api call and db */}
                  {/* <td>{movie.release_date}</td> */}

                  {/* TODO: use tooltips (using react-tooltip) */}
                  <td>
                    <Button
                      className={`w-12 ${movie.watched ? "bg-blue-500" : "bg-gray-300"} hover:bg-yellow-300 hover:text-black`}
                      disabled={isPending}
                      onClick={() => handleToggleWatchedClick(movie.id)}
                    >
                      {movie.watched ? "Yes" : "No"}
                    </Button>
                  </td>

                  <td
                    className={`w-12 h-9 m-2 rounded-md text-sm text-white flex items-center justify-center ${movie.watched && movie.rating ? ratingColors[movie.rating] : "bg-transparent"}`}
                  >
                    <strong>{movie.watched && movie.rating}</strong>
                  </td>

                  {/* 
                  <td>
                    <div
                      className={`w-12 px-4 py-2 text-sm flex items-center justify-center text-primary-foreground rounded-md ${
                        movie.vote_average
                          ? movie.vote_average > 7.0
                            ? "bg-purple-500"
                            : "bg-gray-500"
                          : "bg-transparent"
                      }`}
                    >
                      <strong>{movie.vote_average?.toFixed(1)}</strong>
                    </div> 
                  </td>
                    */}

                  {/* TODO */}
                  {/* <td>movie.addedBy</td> */}

                  <td>
                    {/* TODO: users can only delete movies they added */}
                    <Button
                      className="max-w-sm bg-red-200 hover:bg-destructive"
                      disabled={isPending}
                      onClick={() => handleDeleteClick(movie.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

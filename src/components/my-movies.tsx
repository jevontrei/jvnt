"use client";

import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Movie } from "@/generated/prisma/client";
import { DeleteMovieAction } from "@/actions/delete-movie-action";
import { QueryMoviesDbAction } from "@/actions/query-movies-db-action";
import { ToggleWatchedStatusAction } from "@/actions/toggle-watched-status-action";
import { SeedMoviesAction } from "@/actions/seed-movies-action";
import {
  Database,
  Sprout,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

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

// make an array version (shallow copy) for mapping over below
const ratingColorsArray = Object.entries(ratingColors).slice(1, 8);

export default function MyMovies() {
  const [myMovies, setMyMovies] = useState<Movie[] | null>(null);
  const [dbIsEmpty, setDbIsEmpty] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // TODO: let user sort movies by any column
  // "useMemo is a React Hook that lets you cache the result of a calculation between re-renders"
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

  async function handleRefreshDbSubmit(evt: React.FormEvent<HTMLFormElement>) {
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
      const start = Date.now();
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
      } else {
        setDbIsEmpty(false);
      }

      // only runs if no error
      toast.success("Wowee! The movies database has been seeded! Now fetch it");
      const ms = Date.now() - start;
      console.log(
        `>> Seconds elapsed during seeding = ${Math.floor(ms / 1000)}`,
      );

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
      {dbIsEmpty && (
        // TODO: NEED TO RETHINK THIS BEHAVIOUR! the 'db is empty' msg is appearing after seeding...
        <div>
          <div className="my-2 px-4 py-2 bg-pink-200 rounded-md flex flex-col items-center">
            <p>Looks like the database is empty.</p>
            <p>
              Better go seed the bloody database before fetching again, cobber!
            </p>
            <p>
              And be goddamn patient, okay? It&apos;s just 30 frickin seconds
            </p>
          </div>
        </div>
      )}

      {sortedMovies && (
        <div className="mt-2 max-h-96 overflow-x-auto overflow-y-auto border rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="text-left">Movie</th>
                <th className="text-center">Watched?</th>
                <th className="text-center">Joel&apos;s rating</th>
                <th className="text-center">TMDb rating</th>
                {/* <th className="text-center">Added by</th> */}
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {sortedMovies.map((movie) => (
                // TODO: center buttons under table headings
                <tr key={movie.id} className="even:bg-gray-50">
                  <td>
                    <div className="w-48 overflow-auto">{movie.title}</div>
                  </td>

                  {/* TODO: add release_date (AND POSTER) to api call and db */}
                  {/* <td>{movie.release_date}</td> */}

                  {/* TODO: use tooltips (using react-tooltip) */}

                  <td>
                    <div className="w-full flex justify-center">
                      <Button
                        className={`w-12  text-black ${movie.watched ? "bg-blue-400" : "bg-gray-200"} hover:bg-yellow-300 `}
                        disabled={isPending}
                        onClick={() => handleToggleWatchedClick(movie.id)}
                      >
                        {movie.watched ? (
                          // make toggle icons bigger
                          <ToggleRight size={48} />
                        ) : (
                          <ToggleLeft width={48} />
                        )}
                      </Button>
                    </div>
                  </td>

                  <td className="h-9 m-2 rounded-md text-sm flex items-center">
                    <div className="w-full">
                      {ratingColorsArray.map((color, i) => (
                        <span
                          key={i}
                          // need to use inline-block because by default, spans (and other inline elements) ignore width and height properties
                          className={`${
                            movie.watched &&
                            movie.rating &&
                            movie.rating >= Number(color[0])
                              ? `${ratingColors[i + 1]} inline-block size-3`
                              : "bg-transparent"
                          }`}
                        ></span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div
                      className={`w-full px-4 py-2 text-sm flex items-center justify-center  text-black rounded-md`}
                      //  ${
                      // movie.vote_average
                      // ? movie.vote_average > 7.0
                      // ? "bg-purple-500"
                      // : "bg-gray-500"
                      // : "bg-transparent"
                      // }
                      // `}
                    >
                      <strong>{movie.vote_average?.toFixed(1)}</strong>
                    </div>
                  </td>

                  {/* TODO */}
                  {/* <td
                  // className="flex justify-center"
                  >movie.addedBy</td> */}

                  <td
                  // className="w-full flex justify-center"
                  >
                    <div className="w-full mx-2">
                      {/* TODO: users can only delete movies they added */}
                      <Button
                        className="max-w-sm bg-destructive"
                        disabled={isPending}
                        size="sm"
                        onClick={() => handleDeleteClick(movie.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleRefreshDbSubmit} className="mb-0">
        <Button className="w-64" disabled={isPending}>
          <Database />
          Refresh database
        </Button>
      </form>

      {sortedMovies && sortedMovies.length < 100 && (
        // TODO: add a db.length < 100 state and only show this msg then
        <form
          onSubmit={handleSeedSubmit}
          className="mb-0 mt-12 space-y-2 flex flex-col items-center"
        >
          <p className="text-sm">Database looking empty?</p>
          <p className="text-sm">Click the button to seed the stupid thing.</p>
          <p className="text-sm">
            And be goddamn patient, okay? It&apos;s just 30 seconds
          </p>
          <Button className="w-64" disabled={isPending}>
            <Sprout />
            Seed database
          </Button>
        </form>
      )}
    </div>
  );
}

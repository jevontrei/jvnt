"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Movie } from "@/generated/prisma/client";
import { DeleteMovieAction } from "@/actions/delete-movie-action";
import { QueryMoviesDbAction } from "@/actions/query-movies-db-action";
import { ToggleLikedStatusAction } from "@/actions/toggle-liked-status-action";
import { ToggleWatchedStatusAction } from "@/actions/toggle-watched-status-action";

export default function MyMovies() {
  const [myMovies, setMyMovies] = useState<Movie[] | null>(null);
  const [dbIsEmpty, setDbIsEmpty] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
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

  async function handleToggleWatchedClick(movieId: string) {
    // note: we don't need evt or evt.preventDefault() here because handleToggleWatchedClick is not coming from a form element or link click -- so there's no reload to prevent
    setIsPending(true);

    // TODO: while mark as un/watched buttons are pending and grayed out, they creep over into the table header. looks bad. fix it. (same for liked toggle button?)

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
  async function handleToggleLikedClick(movieId: string) {
    // note: we don't need evt or evt.preventDefault() here because handleToggleLikedClick is not coming from a form element or link click -- so there's no reload to prevent
    setIsPending(true);

    try {
      toast.info("Thinking...");

      const { error, data } = await ToggleLikedStatusAction(movieId);

      if (error) {
        console.log(
          "[toggle-liked-status-action] Failed to fetch movies or toggle status:",
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
      toast.success("Yippee!");

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
      <form onSubmit={handleSubmit} className="mb-0">
        <Button className="w-64" disabled={isPending}>
          Fetch/refresh my database
        </Button>
      </form>

      {dbIsEmpty && (
        <div className="my-2 px-4 py-2 bg-pink-200 rounded-md">
          Looks like the database is empty! Better go fetch some bloody movies
          cobber!
        </div>
      )}

      {myMovies && (
        <div className="mt-2 max-h-96 overflow-y-auto border rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="text-left">Movie</th>
                <th className="text-left">Joel watched</th>
                <th className="text-left">Joel liked</th>
                <th className="text-left">Rating</th>
                {/* <th className="text-left">Added by</th> */}
                <th className="text-left"></th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: sort movies by watched, and eventually sort by any column */}
              {myMovies.map((movie) => (
                <tr key={movie.id} className="even:bg-gray-50">
                  <td>{movie.title}</td>

                  {/* TODO: add release_date (AND POSTER) to api call and db */}
                  {/* <td>{movie.release_date}</td> */}

                  <td>
                    <Button
                      className={`w-12 ${movie.watched ? "bg-blue-500" : "bg-gray-300"} hover:bg-yellow-300 hover:text-black`}
                      disabled={isPending}
                      onClick={() => handleToggleWatchedClick(movie.id)}
                    >
                      {movie.watched ? "Yes" : "No"}
                    </Button>
                  </td>

                  {/* TODO: use tooltips (using react-tooltip) */}
                  <td>
                    <Button
                      // don't need type="submit" here; that's only for forms
                      className={`w-16 ${!movie.watched ? "bg-transparent text-transparent" : movie.liked ? "bg-green-500" : "bg-gray-300"} hover:bg-yellow-300 hover:text-black`}
                      // no point displaying the liked button if i haven't seen the movie
                      // TODO: always set db liked to false if movie is or gets set to unwatched
                      disabled={isPending || !movie.watched}
                      onClick={() => handleToggleLikedClick(movie.id)}
                    >
                      {!movie.watched ? "" : movie.liked ? "Liked" : "Eh"}
                    </Button>
                  </td>

                  {/* TODO: color scale by rating CONTINUOUSLY! */}
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

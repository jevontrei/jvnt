"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { QueryMoviesDbAction } from "@/actions/query-movies-db-action";
import { Movie } from "@/generated/prisma/client";

export default function MyMovies() {
  const [myMovies, setMyMovies] = useState<Movie[] | null>(null);
  const [dbIsEmpty, setDbIsEmpty] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    try {
      toast.info("Thinking...");
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
      toast.success("Hell yeah!");
      setMyMovies(data);
      console.log("Movies from DB:", data);
    } catch (err) {
      console.log("Error from my-movies.tsx:", err);
      toast.error(`Network error: ${err}`);
    } finally {
      // always re-enable button
      setIsPending(false);
    }
  }

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit}>
        <Button disabled={isPending}>
          See what&apos;s already in my database
        </Button>
      </form>

      {dbIsEmpty && (
        <div>
          Looks like the db is empty! Better go fetch some bloody movies!
        </div>
      )}

      {myMovies && (
        <div className="mt-8 max-h-96 overflow-y-auto border rounded">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Watched</th>
              </tr>
            </thead>
            <tbody>
              {myMovies.map((movie, i) => (
                <tr key={i}>
                  <td>{movie.title}</td>
                  <td>{String(movie.watched)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

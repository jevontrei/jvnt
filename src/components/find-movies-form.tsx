"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CirclePlus, Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { AddOneMovieToDbAction } from "@/actions/add-one-movie-to-db-action";
import { FindMoviesAction } from "@/actions/find-movies-action";
import { TmdbMovieDataType } from "@/actions/call-tmdb-api-action";

// https://developer.themoviedb.org/docs/rate-limiting

export default function FindMoviesForm() {
  const [isPending, setIsPending] = useState(false);
  const [movieResults, setMovieResults] = useState<TmdbMovieDataType[] | null>(
    null,
  );

  async function handleSearchSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    try {
      toast.info("Connecting to TMDb API...");
      const formData = new FormData(evt.target as HTMLFormElement);
      const { error, data } = await FindMoviesAction(formData);
      if (error) {
        toast.error(error);
        return;
      }

      // only runs if no error
      // const { error: addMovieError, data: addMovieData } =
      //   await handleAddMovieToDbSubmit(movie);
      toast.success("Success!");
      setMovieResults(data);
    } catch (err) {
      if (err instanceof TypeError) {
        console.log(">> Oops! TypeError:", err);
        return;
      }
      toast.error(`hmmm, ${err}`);
    } finally {
      // ALWAYS re-enable button
      setIsPending(false);
    }
  }

  async function handleAddMovieToDbSubmit(movie: TmdbMovieDataType) {
    setIsPending(true);
    try {
      toast.info("Adding movie to database...");
      const { error, data } = await AddOneMovieToDbAction(movie);
      console.log(data);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Movie added to database");
      // TODO: figure this out:
      // setMovieResults([data]);
    } catch (err) {
      if (err instanceof TypeError) {
        console.log(">> Oops! TypeError:", err);
        return;
      }
      toast.error(`hmmm, ${err}`);
    } finally {
      // ALWAYS re-enable button
      setIsPending(false);
    }
  }

  return (
    <div className="mt-6 mx-4">
      <div className="p-8 flex flex-col items-center">
        <form onSubmit={handleSearchSubmit} className="w-64 space-y-2">
          <div>
            <Label htmlFor="title" className="p-2 flex justify-center">
              Find a movie for me to watch
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a movie title..."
            />
          </div>

          {/* <div className="space-y-2"> */}
          {/* TODO: make this a radio button or dropdown, with watched/unwatched */}
          {/* <Label htmlFor="watched">Watch status</Label> */}
          {/* <Input id="watched" name="watched" /> */}
          {/* </div> */}

          <Button type="submit" className="w-64" disabled={isPending}>
            <Search />
            Find
          </Button>
        </form>

        {movieResults && (
          <>
            <div className="mt-6">
              <p>Top search results from TMDb:</p>
            </div>
            <div className="my-2 overflow-x-auto overflow-y-auto border rounded flex flex-col items-center">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-200">
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-center">Release date</th>
                    <th className="text-center">Vote average</th>
                    <th className="text-center">Add to database?</th>
                  </tr>
                </thead>

                <tbody>
                  {movieResults.map((movie, i) => (
                    <tr key={i}>
                      <td>
                        <div className="w-64 flex justify-start overflow-auto">
                          {movie.title}
                        </div>
                      </td>
                      <td>
                        <div className="w-full flex justify-center">
                          {movie.release_date}
                        </div>
                      </td>
                      <td>
                        <div className="w-full flex justify-center">
                          {movie.vote_average.toFixed(1)}
                        </div>
                      </td>
                      <td>
                        <div className="w-full flex justify-center">
                          {
                            <Button
                              className="bg-blue-400"
                              onClick={() => handleAddMovieToDbSubmit(movie)}
                              disabled={isPending}
                            >
                              <CirclePlus />
                            </Button>
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
import { redirect } from "next/navigation";

// https://developer.themoviedb.org/docs/rate-limiting

export default function RecommendMovieForm() {
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
      if (!data) {
        toast.error("Search data is empty");
        return;
      }

      // only runs if no error
      // TODO: do i need to do anything here?
      toast.success(`Found ${data.length} movies`);
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
      redirect("/movies");
    }
  }

  return (
    <div className="m-4">
      <div className="p-8 flex flex-col items-center">
        <form onSubmit={handleSearchSubmit} className="w-64 space-y-2">
          <div>
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

          <Button type="submit" className="w-64 " disabled={isPending}>
            <Search />
            Search
          </Button>
        </form>

        {movieResults && (
          <>
            {/* <div className="mt-12">
              <p>
                <strong>Top results from TMDb</strong>
              </p>
            </div> */}
            <div className="mt-8 overflow-x-auto overflow-y-auto border rounded flex flex-col items-center">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-200">
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-center">Release date</th>
                    <th className="text-center">TMDb rating</th>
                    <th className="text-center">Add to database?</th>
                  </tr>
                </thead>

                <tbody>
                  {movieResults.map((movie, i) => (
                    <tr key={i} className="even:bg-gray-50">
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
                              className="bg-blue-600"
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

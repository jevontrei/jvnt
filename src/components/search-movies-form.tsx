"use client";

import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { SearchMoviesAction } from "@/actions/search-movies-action";
import { TmdbMovieDataType } from "@/actions/call-tmdb-api-action";
import { Search } from "lucide-react";

// https://developer.themoviedb.org/docs/rate-limiting

export default function SearchMoviesForm() {
  const [isPending, setIsPending] = useState(false);
  const [movieResults, setMovieResults] = useState<TmdbMovieDataType | null>(
    null,
  );

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    try {
      toast.info("Connecting to TMDb API...");
      const formData = new FormData(evt.target as HTMLFormElement);
      const { error, data } = await SearchMoviesAction(formData);
      if (error) {
        toast.error(error);
        return;
      }
      // only runs if no errer
      toast.success("Movie found and added to database.");
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

  return (
    <div className="mt-6 mx-4">
      <div className="p-8 flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-64 space-y-2">
          <div>
            <Label htmlFor="title" className="p-2 flex justify-center">
              Request that I watch a movie
            </Label>
            <Input id="title" name="title" placeholder="jaws" />
          </div>

          {/* <div className="space-y-2"> */}
          {/* TODO: make this a radio button or dropdown, with watched/unwatched */}
          {/* <Label htmlFor="watched">Watch status</Label> */}
          {/* <Input id="watched" name="watched" /> */}
          {/* </div> */}

          <Button type="submit" className="w-64" disabled={isPending}>
            <Search />
            Search
          </Button>
        </form>

        {movieResults && (
          <div className="px-4 py-2 my-2 overflow-y-auto bg-purple-100 rounded-md">
            <span>
              {/* TODO: include release_date here */}
              Found movie title: <strong>{movieResults.title}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  SearchMoviesAction,
  MovieDataType,
} from "@/actions/search-movies-action";

// https://developer.themoviedb.org/docs/rate-limiting

export default function SearchMoviesForm() {
  const [isPending, setIsPending] = useState(false);
  const [movieResults, setMovieResults] = useState<MovieDataType | null>(null);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    try {
      toast.info("Thinking...");
      const formData = new FormData(evt.target as HTMLFormElement);
      const { error, data } = await SearchMoviesAction(formData);
      if (error) {
        toast.error(error);
        return;
      }
      // only runs if no irrer
      toast.success("Hell yeah!");
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
    <div className="p-8">
      {movieResults && (
        <div className="mt-8 max-h-96 overflow-y-auto border rounded">
          <p>Result:</p>
          {movieResults.title}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Movie title search</Label>
          <Input id="title" name="title" />
        </div>

        {/* <div className="space-y-2"> */}
        {/* TODO: make this a radio button or dropdown, with watched/unwatched */}
        {/* <Label htmlFor="watched">Watch status</Label> */}
        {/* <Input id="watched" name="watched" /> */}
        {/* </div> */}

        <Button type="submit" className="w-full" disabled={isPending}>
          Search
        </Button>
      </form>
    </div>
  );
}

"use client";

import MyMovies from "@/components/my-movies";
import SearchMoviesForm from "@/components/search-movies-form";

// default export
export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-6xl mt-8 mx-4">Movies</h2>
      <SearchMoviesForm />
      <MyMovies />
    </div>
  );
}

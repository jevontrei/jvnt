"use client";

import MyMovies from "@/components/my-movies";
import SearchMoviesForm from "@/components/search-movies-form";

// default export
export default function Page() {
  return (
    <>
      <SearchMoviesForm />
      <MyMovies />
    </>
  );
}

"use client";

import MyMoviesDb from "@/components/my-movies";
import FindMoviesForm from "@/components/find-movies-form";

// default export
export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-6xl mt-8 mx-4">Movies</h2>
      <FindMoviesForm />
      <MyMoviesDb />
    </div>
  );
}

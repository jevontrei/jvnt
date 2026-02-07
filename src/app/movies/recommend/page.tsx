"use client";

import RecommendMovieForm from "@/components/recommend-movie-form";
import Image from "next/image";

// default export
export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-6xl my-8 mx-4">Recommend</h2>

      {/* TODO: back button */}

      <Image
        className="mt-12"
        src="/tmdb.svg"
        alt="TMDb logo"
        width={256}
        height={64}
      />

      <p className="mt-4 text-center max-w-96 overflow-auto">
        This form searches The Movie Database (TMDb), then lets you select
        something from the results to add to my database.
      </p>

      <RecommendMovieForm />
    </div>
  );
}

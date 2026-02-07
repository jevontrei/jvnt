"use client";

import MyMoviesDb from "@/components/my-movies";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

// default export
export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-6xl my-8 mx-4">Movies</h2>
      <Link href="/movies/recommend">
        <Button className="w-52 m-4">
          <CirclePlus />
          Recommend me a movie
        </Button>
      </Link>
      <MyMoviesDb />
    </div>
  );
}

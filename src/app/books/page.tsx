"use client";

import MyBooks from "@/components/my-books";
import SearchBooksForm from "@/components/search-books-form";

// default export
export default function Page() {
  return (
    <>
      <SearchBooksForm />
      <MyBooks />
    </>
  );
}

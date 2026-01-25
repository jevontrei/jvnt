"use server";

// do i even need to write "use server"?

import { prisma } from "@/lib/prisma";

// define types for the return value of this action; to prevent annoying typescript complaints in search-forecast-form.tsx
// type export -- must import with exact name
// TODO: don't do this; just grab the schema's type that already exists
export type BookDataType = {
  title: string;
  watched: boolean;
  //   year: number;
};

// i find this pattern of types very cool... much better than what i had before, e.g. `error: string | null`
type ActionSuccessType = {
  error: null;
  data: BookDataType;
};

type ActionErrorType = {
  error: string;
  data: null;
};

// the ~pipe here ("|") is typescript union type? not a normal OR operator
type ActionResultType = ActionSuccessType | ActionErrorType;

// TODO: handle when user enters crazy string -> timeout

// Promise here is a generic type; <ActionResultType> is a generic type argument
export async function SearchBooksAction(
  formData: FormData,
): Promise<ActionResultType> {
  try {
    // get form inputs
    // for more robust validation, could use zod or valibot
    const title = String(formData.get("title"));

    // validate
    if (!title) {
      console.log("title error...");
      return {
        error: "Please enter your title",
        data: null,
      };
    }

    // make API request
    // https://developers.google.com/books/docs/v1/reference/volumes/get
    const volumeIdForUrl = encodeURIComponent(title); // this changes spaces to %20 etc
    const url = `https://www.googleapis.com/books/v1/volumes/${volumeIdForUrl}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const json = await response.json();
    const result = json["results"][0];
    // console.log(Object.keys(json));
    // console.log(json);
    // console.log(result["title"]);

    const book: BookDataType = {
      title: result["title"],
      watched: result["watched"],
    };
    console.log("book:", book);

    // add book to db
    await prisma.book.create({ data: book });

    // // return data to browser
    return { error: null, data: book };
  } catch (err) {
    console.log(err);

    if (err instanceof Error) {
      if (err.message.includes("...")) {
        return {
          error: "relevant msg...",
          data: null,
        };
      }
    }

    // fallback for unknown error (without details... see log for details)
    return { error: "Unexpected error occurred", data: null };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { Book } from "@/generated/prisma/client";

type DbQuerySuccessType = {
  error: null;
  data: Book[];
};

type DbQueryErrorType = {
  error: string;
  data: null;
};

type DbQueryType = DbQuerySuccessType | DbQueryErrorType;

//
// TODO: use Marko's db
//

export async function QueryBooksDbAction(): Promise<DbQueryType> {
  try {
    const dbResponse = await prisma.book.findMany();

    // return data to browser
    return {
      error: null,
      data: dbResponse,
    };
  } catch (err) {
    console.log("Error in database fetching:", err);
    return { error: String(err), data: null };
  }
}

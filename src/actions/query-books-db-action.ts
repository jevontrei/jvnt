// "use server";

// import { prisma } from "@/lib/prisma-nas";
// import { Book } from "@/generated/prisma/client"; // "client" = Prisma's library name, not client-side code (works on server too)
// import { notifyDiscord } from "./notify-discord-action";

// type DbQuerySuccessType = {
//   error: null;
//   data: Book[];
// };

// type DbQueryErrorType = {
//   error: string;
//   data: null;
// };

// type DbQueryType = DbQuerySuccessType | DbQueryErrorType;

// //
// // TODO: use Marko's db
// //

// export async function QueryBooksDbAction(): Promise<DbQueryType> {
//   try {
//     const dbResponse = await prisma.book.findMany();

//     await notifyDiscord(`Books db queried: ${dbResponse.length} books found`);

//     // return data to browser
//     return {
//       error: null,
//       data: dbResponse,
//     };
//   } catch (err) {
//     console.log("Error in database fetching:", err);
//     return { error: String(err), data: null };
//   }
// }

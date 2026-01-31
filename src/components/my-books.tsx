// "use client";

// import { useState } from "react";
// import { Button } from "./ui/button";
// import { toast } from "sonner";
// import { Book } from "@/generated/prisma/client";
// import { QueryBooksDbAction } from "@/actions/query-books-db-action";
// import { ToggleReadStatusAction } from "@/actions/toggle-read-status-action";

// export default function MyBooks() {
//   const [myBooks, setMyBooks] = useState<Book[] | null>(null);
//   const [dbIsEmpty, setDbIsEmpty] = useState(false);
//   const [isPending, setIsPending] = useState(false);

//   async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
//     evt.preventDefault();
//     setIsPending(true);

//     try {
//       toast.info("Thinking...");
//       const { error, data } = await QueryBooksDbAction();

//       if (error) {
//         console.log("[search-books-action] Failed to fetch books:", error);
//         toast.error(error);
//         return;
//       }

//       if (!data || data.length === 0) {
//         setDbIsEmpty(true);
//         toast.info("Database is empty!");
//         return;
//       }

//       // only runs if no error
//       toast.success("Hell yeah!");
//       // TODO: this still doesn't trigger a re-render of the table... when i search a book, my db does get updated, but the "my books" table doesn't unless i click "see what's in my db" again
//       setMyBooks(data);
//     } catch (err) {
//       console.log("Error from my-books.tsx:", err);
//       toast.error(`Network error: ${err}`);
//     } finally {
//       // always re-enable button
//       setIsPending(false);
//     }
//   }

//   async function handleClick(bookId: string) {
//     // note: we don't need evt or evt.preventDefault() here because handleClick is not coming from a form element or link click -- so there's no reload to prevent
//     setIsPending(true);

//     try {
//       toast.info("Thinking...");

//       const { error, data } = await ToggleReadStatusAction(bookId);

//       if (error) {
//         console.log(
//           "[toggle-read-status-action] Failed to fetch books or toggle status:",
//           error,
//         );
//         toast.error(error);
//         return;
//       }
//       // i don't think this would happen, except maybe in a crazy unlucky scenario (?)
//       if (!data) {
//         setDbIsEmpty(true);
//         toast.info("Database is empty!");
//         return;
//       }

//       // only runs if no error
//       toast.success("Hell yeah!");

//       //  update myBooks with data
//       if (!myBooks) return; // early return just to satisfy ts (myBooks won't be null here because of {myBooks && ...} below)
//       const updatedMyBooks = myBooks.map((book) =>
//         book.id === data.id ? data : book,
//       );
//       setMyBooks(updatedMyBooks);
//     } catch (err) {
//       console.log("Error from my-books.tsx:", err);
//       toast.error(`Network error: ${err}`);
//     } finally {
//       // always re-enable button
//       setIsPending(false);
//     }
//   }

//   return (
//     <div className="p-8">
//       <form onSubmit={handleSubmit}>
//         <Button disabled={isPending}>See what&apos;s in my database</Button>
//       </form>

//       {dbIsEmpty && (
//         <div className="my-8">
//           Looks like the db is empty! Better go fetch some bloody books!
//         </div>
//       )}

//       {myBooks && (
//         <div className="mt-8 max-h-96 overflow-y-auto border rounded">
//           <table className="w-full">
//             <thead className="sticky top-0 bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Title</th>
//                 <th className="p-2 text-left">Status</th>
//                 <th className="p-2 text-left">Action</th>
//                 <th className="p-2 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myBooks.map((book) => (
//                 <tr key={book.id}>
//                   <td>{book.title}</td>
//                   <td>{book.read ? <span>Read</span> : null}</td>
//                   <td>
//                     <Button
//                       // don't need type="submit" her;, that's only for forms
//                       className="w-sm"
//                       disabled={isPending}
//                       onClick={() => handleClick(book.id)}
//                     >
//                       {book.read ? (
//                         <span>Mark as unread</span>
//                       ) : (
//                         <span>Mark as read</span>
//                       )}
//                     </Button>
//                   </td>
//                   <td>
//                     <Button
//                       className="w-sm"
//                       disabled={isPending}
//                       onClick={() => handleClick(book.id)}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

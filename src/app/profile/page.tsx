import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// default export -- can import with any name
export default async function Page() {
  // this is a server component so we use `auth` from auth.ts, not auth-client.ts; we can use server functionality here
  const session = await auth.api.getSession({
    // we need to import headers from next/headers and pass them into our session; that's how better auth knows about our session
    headers: await headers(),
  });

  // we knew to do this check because we hovered over session and saw that it was typed and could be null
  if (!session) {
    return <p className="text-destructive">Unauthorised</p>;
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <SignOutButton />

      <pre className="text-sm overflow-clip">
        {/* this displays session as a json object in a nice format */}
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}

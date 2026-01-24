"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignOutButton = () => {
  // use router hook
  const router = useRouter();

  async function handleClick() {
    // we are on the client, so we use signOut from auth-client
    await signOut({
      fetchOptions: {
        onError: (ctx) => {
          // this should only happen if server is down, or if somehow you're seeing this button when you're not signed in
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <Button onClick={handleClick} size="sm" variant="destructive">
      Sign Out
    </Button>
  );
};

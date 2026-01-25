import Link from "next/link";
import { Button } from "./button";

// default export
export default function NavBar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Login",
      link: "/auth/login",
    },
    {
      name: "Register",
      link: "/auth/register",
    },
    {
      name: "Profile",
      link: "/profile",
    },
    {
      name: "Movies",
      link: "/movies",
    },
    {
      name: "Books",
      link: "/books",
    },
    {
      name: "Music",
      link: "/music",
    },
    {
      name: "Up",
      link: "/up",
    },
  ];

  return (
    <div className="p-8">
      {navItems.map((navItem, i) => {
        return (
          // TODO: fix this tw
          <Button key={i} className="gap-4">
            <Link href={navItem.link}>{navItem.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}

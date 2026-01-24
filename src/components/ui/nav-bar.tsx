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
    <>
      {navItems.map((navItem, i) => {
        return (
          <Button key={i}>
            <Link href={navItem.link}>{navItem.name}</Link>
          </Button>
        );
      })}
    </>
  );
}

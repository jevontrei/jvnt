import Link from "next/link";
import { Button } from "./button";

// default export
export default function NavBar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    // {
    //   name: "Login",
    //   link: "/auth/login",
    // },
    // {
    //   name: "Register",
    //   link: "/auth/register",
    // },
    // {
    //   name: "Profile",
    //   link: "/profile",
    // },
    {
      name: "Movies",
      link: "/movies",
    },
    {
      name: "Photons",
      link: "/photons",
    },
    // {
    //   name: "Books",
    //   link: "/books",
    // },
    // {
    //   name: "Music",
    //   link: "/music",
    // },
    // {
    //   name: "Blog",
    //   link: "/blog",
    // },
    // {
    //   name: "Up",
    //   link: "/up",
    // },
  ];

  return (
    <div className="my-6 mx-4 flex justify-center-safe flex-wrap">
      {navItems.map((navItem, i) => {
        return (
          // TODO: fix this tw
          <Button key={i} className="m-1">
            <Link href={navItem.link}>{navItem.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { Button } from "./button";
import { Camera, Clapperboard, House } from "lucide-react";

// default export
export default function NavBar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <House />,
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
      icon: <Clapperboard />,
    },
    {
      name: "Photons",
      link: "/photons",
      icon: <Camera />,
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
          <Button key={i} className="m-1">
            {navItem.icon}
            <Link href={navItem.link}>{navItem.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}

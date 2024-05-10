"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import LogoutButton from "./logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type T_NavItems = {
  route: string;
  title: string;
};

type T_Navigation = {
  navItems: T_NavItems[];
  pathname: string;
  className?: string;
};
export default function Navigations({ className }: { className?: string }) {
  const pathname = usePathname();
  const navItems = [
    { route: "/movies", title: "Home" },
    { route: "/profile", title: "Profile" },
  ];
  return (
    <nav className={className}>
      <NavigationList
        className="hidden sm:flex"
        navItems={navItems}
        pathname={pathname}
      />
      <NavigationMenu
        className="sm:hidden"
        navItems={navItems}
        pathname={pathname}
      />
    </nav>
  );
}

function NavigationList({ ...props }: T_Navigation) {
  return (
    <ul className={cn("flex", props.className)}>
      {props.navItems.map((nav, index) => (
        <li key={index}>
          <Button
            variant="link"
            className={cn(nav.route == props.pathname && "underline")}
            asChild
          >
            <Link href={nav.route}>{nav.title}</Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}

function NavigationMenu({ ...props }: T_Navigation) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={props.className} asChild>
        <Button variant="ghost" size="icon">
          <Menu size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("space-y-1", props.className)}
        align="end"
      >
        {props.navItems.map((nav, index) => (
          <DropdownMenuItem key={index} className="p-0">
            <Button
              variant={nav.route == props.pathname ? "default" : "link"}
              className={cn("w-full justify-start")}
              asChild
            >
              <Link href={nav.route}>{nav.title}</Link>
            </Button>
          </DropdownMenuItem>
        ))}
        <Separator />
        <DropdownMenuItem className="justify-center p-1">
          <LogoutButton className="flex w-full space-x-1" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

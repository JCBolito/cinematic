import LogoutButton from "../atoms/logout";
import Navigations from "../atoms/navigations";
import ModeToggle from "../atoms/theme-toggle";
import { FilmIcon } from "lucide-react";
import Link from "next/link";

type T_Header = {
  session?: boolean;
};
export default function Header({ ...props }: T_Header) {
  return (
    <header className="flex h-[60px] items-center justify-center border-b px-4 dark:border-white/20 sm:px-6">
      <section className="flex w-full max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FilmIcon className="h-6 w-6" />
          <span className="font-semibold">Cinematic</span>
        </Link>
        <div className="flex items-center gap-2">
          {props.session && <Navigations className="hidden sm:block" />}
          <div>
            <ModeToggle />
          </div>
          {props.session && <Navigations className="sm:hidden" />}
          {props.session && (
            <LogoutButton type="icon" className="hidden sm:flex" />
          )}
        </div>
      </section>
    </header>
  );
}

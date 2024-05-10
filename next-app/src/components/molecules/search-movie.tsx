"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";

export default function SearchMovie({ className }: { className?: string }) {
  const router = useRouter();
  const params = new URLSearchParams(useSearchParams());

  const [search, setSearch] = useState(params.get("search") ?? "");

  function handleSearch(e: FormEvent) {
    const movie = document.getElementById("movieList");
    e.preventDefault();
    params.set("search", search);
    params.delete("page");
    router.push(`?${params}`, { scroll: false });
    if (movie) {
      movie.scrollIntoView({ behavior: "smooth" });
    }
  }

  function clearSearch(searchValue: string) {
    if (searchValue == "") {
      params.delete("search");
      router.push(`?${params}`, { scroll: false });
    }
  }

  function changeSearch(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearch(value);
    clearSearch(value);
  }

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "flex w-full max-w-[400px] justify-center gap-2",
        className,
      )}
    >
      <Input
        className="flex-1"
        placeholder="Search for a movie..."
        type="text"
        value={search}
        onChange={changeSearch}
      />
      <Button>Search</Button>
    </form>
  );
}

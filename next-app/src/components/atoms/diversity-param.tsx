"use client";

import { Button } from "../ui/button";
import { revalidate } from "@/services/fast-api";
import { useRouter, useSearchParams } from "next/navigation";

export default function DiversityParameter() {
  const diversity = useSearchParams().get("dp") ?? 0.5;
  const params = new URLSearchParams(useSearchParams());
  const router = useRouter();
  const values = [0, 0.5, 1.0];

  function diversityHandler(value: number) {
    params.set("dp", value.toString());
    params.delete("focus");
    params.delete("origin");
    router.push(`/movies?${params}`, { scroll: false });
  }

  return (
    <section className="rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
      {values.map((value) => (
        <Button
          key={value}
          onClick={() => diversityHandler(value)}
          variant={+diversity === value ? "default" : "ghost"}
          size="icon"
          className="text-xs"
        >
          {value.toFixed(2)}
        </Button>
      ))}
    </section>
  );
}

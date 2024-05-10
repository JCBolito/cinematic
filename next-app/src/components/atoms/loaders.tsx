import { Skeleton } from "@/components/ui/skeleton";

export function MovieCarouselLoader() {
  return (
    <section className="flex w-full gap-2 overflow-hidden">
      <Skeleton className="min-h-[450px] w-full " />
    </section>
  );
}

export function MovieListLoader() {
  return (
    <section
      id="movieList"
      className="flex max-w-[2000px] flex-wrap justify-center gap-4 self-center p-4"
    >
      {Array.from({ length: 30 }).map((_, index) => (
        <Skeleton key={index} className="min-h-[450px] w-[300px] " />
      ))}
    </section>
  );
}

"use client";

import MovieCard from "../molecules/movie-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { movies } from "@/database/schema";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function MovieCarousel({
  data,
}: {
  data: InferSelectModel<typeof movies>[] | never[];
}) {
  const plugin = useRef(Autoplay({ delay: 1500, stopOnInteraction: true }));
  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        loop: true,
        align: "center",
      }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
      className="overflow-hidden rounded"
    >
      <CarouselContent
        className={cn(
          data?.length < 6 && "xl:justify-center",
          data?.length < 4 && "md:justify-center",
          data?.length < 3 && "sm:justify-center",
        )}
      >
        {data?.map((movie) => (
          <CarouselItem
            key={movie.movieId}
            className={cn("basis-1/1 sm:basis-1/3 md:basis-1/4 xl:basis-1/6")}
          >
            <MovieCard movie={movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

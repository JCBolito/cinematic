import BackButton from "@/components/atoms/back-button";
import StarRating from "@/components/molecules/star-rating";
import { ABRCBFSpecific } from "@/components/organisms/abrcbf-section";
import { CBFSpecific } from "@/components/organisms/cbf-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getMovieById } from "@/services/in-app/movies";
import { rate, clearRating } from "@/services/in-app/ratings";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const { data } = await getMovieById(+params.id);
  const { ratings, movies } = data[0];

  async function rateMovie(value: number, id: number) {
    "use server";
    return await rate(value, id);
  }

  async function clearMovieRating(id: number) {
    "use server";
    return await clearRating(id);
  }

  return (
    <main className="relative grid content-start items-start justify-center">
      <section className="max-w-screen-xl p-4">
        <BackButton />
        <section className="mt-3 grid gap-8 overflow-auto rounded-lg lg:grid-cols-[auto_auto]">
          <div className="justify-self-center">
            <Image
              alt="Movie Poster"
              className="aspect-[2/3] overflow-hidden rounded-lg border border-neutral-200 object-cover dark:border-neutral-800"
              height={600}
              src={`${movies.poster}`}
              width={400}
              priority={true}
            />
          </div>
          <section className="relative grid content-start items-start gap-4">
            <section className=" grid items-start gap-4">
              <h1 className="text-3xl font-bold">{movies.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  {new Date(`${movies?.release_date}`).getFullYear()}
                </span>
                <span className="text-sm font-semibold">
                  {Math.floor(movies.runtime / 60)}h {movies.runtime % 60}m
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {movies?.genres.map((genre, index) => (
                  <Badge variant="secondary" key={index}>
                    {genre}
                  </Badge>
                ))}
              </div>
              <div className="flex w-full gap-4">
                <Button className="w-full sm:w-auto" asChild>
                  <Link href={movies.video ?? ""} target="_blank">
                    <Play />
                    Play
                  </Link>
                </Button>
              </div>
              <StarRating
                id={movies.movieId}
                currentRating={ratings?.rating}
                rateHandler={rateMovie}
                clearRatingHandler={clearMovieRating}
              />
            </section>
            <Separator />
            <section className="gap-4 text-xs leading-loose text-gray-500 dark:text-gray-400">
              <span className="font-bold">Keywords: </span>
              <span>{movies.keywords?.join(" • ")}</span>
            </section>
            <Separator />
            <section className="grid gap-4 text-sm leading-loose">
              {movies?.overview}
            </section>
          </section>
        </section>
      </section>
      <CBFSpecific movieId={params.id} />
      <ABRCBFSpecific movieId={params.id} />
    </main>
  );
}

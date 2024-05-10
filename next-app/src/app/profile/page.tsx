import { MovieListLoader } from "@/components/atoms/loaders";
import SearchMovie from "@/components/molecules/search-movie";
import MoviesSection from "@/components/organisms/movies-section";
import { Suspense } from "react";

export default async function Homepage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col">
      <section className="flex h-[350px] min-h-[250px] items-center justify-center p-4 sm:p-6">
        <div className="container relative z-10 flex w-full flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
              Movies you rated.
            </h1>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              View movies you previously watched and rated.
            </p>
          </div>
          <Suspense>
            <SearchMovie className="self-center" />
          </Suspense>
        </div>
      </section>
      <Suspense fallback={<MovieListLoader />}>
        <MoviesSection searchParams={searchParams} route="profile" />
      </Suspense>
    </main>
  );
}

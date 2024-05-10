import { MovieListLoader } from "@/components/atoms/loaders";
import SearchMovie from "@/components/molecules/search-movie";
import { ABRCBFSection } from "@/components/organisms/abrcbf-section";
import { CBFSection } from "@/components/organisms/cbf-section";
import MoviesSection from "@/components/organisms/movies-section";
import { getSession } from "@/services/in-app/token";
import { Suspense } from "react";

export default async function Homepage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  return (
    <>
      <section className="flex min-h-[calc(100vh-60px)] flex-1 flex-col">
        <section className="flex h-[350px] min-h-[250px] items-center justify-center p-4 sm:p-6">
          <div className="container relative z-10 flex w-full flex-col gap-4">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                Watch Movies. Anywhere.
              </h1>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Welcome to Cinematic, {session?.firstName}! Enjoy your movie
                experience!
              </p>
            </div>
            <Suspense>
              <SearchMovie className="self-center" />
            </Suspense>
          </div>
        </section>
        <main className="grid justify-center gap-4">
          <CBFSection searchParams={searchParams} />
          <ABRCBFSection searchParams={searchParams} />
          <section className="grid gap-4">
            <section className="mx-auto max-w-sm text-center">
              <h2 className="text-xl font-bold">Movies</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Find what you&apos;re looking for in our wide selection of
                films!
              </p>
            </section>
            <Suspense fallback={<MovieListLoader />}>
              <MoviesSection searchParams={searchParams} />
            </Suspense>
          </section>
        </main>
      </section>
    </>
  );
}

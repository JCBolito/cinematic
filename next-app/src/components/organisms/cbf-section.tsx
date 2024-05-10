import { MovieCarouselLoader } from "../atoms/loaders";
import MovieRecommendations from "../molecules/movie-recom";
import { getUserMovieRatings } from "@/services/in-app/users";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export async function CBFSection({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userMovieRatingsLength = await getUserMovieRatings().then(
    (res) => res.data.length,
  );
  return (
    <section className="mx-auto flex w-full max-w-[2000px] flex-col gap-4 p-4">
      <section className="max-w-sm">
        <h2 className="text-xl font-bold">CBF Recommendations</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Recommendations made by the original Content-based Filtering
          algorithm.
        </p>
      </section>
      {userMovieRatingsLength < 1 ? (
        <p className="mx-auto max-w-md text-center text-gray-500 dark:text-gray-400">
          You lack the number of items rated. Rate more movies to enable
          Content-based Filtering recommendations.
        </p>
      ) : (
        <Suspense fallback={<MovieCarouselLoader />}>
          <MovieRecommendations
            algo="cbf"
            movieRatings={userMovieRatingsLength}
          />
        </Suspense>
      )}
    </section>
  );
}

export async function CBFSpecific({ movieId }: { movieId: string }) {
  return (
    <section className="mx-auto flex w-full max-w-[2000px] flex-col gap-4 p-4">
      <section className="max-w-md">
        <h2 className="text-xl font-bold">CBF Recommendations</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Similar movies according to the original Content-based Filtering
          algorithm.
        </p>
      </section>
      <Suspense fallback={<MovieCarouselLoader />}>
        <MovieRecommendations algo="cbf" movieId={movieId} />
      </Suspense>
    </section>
  );
}

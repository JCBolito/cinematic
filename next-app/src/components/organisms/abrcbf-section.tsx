import DiversityParameter from "../atoms/diversity-param";
import { MovieCarouselLoader } from "../atoms/loaders";
import MovieRecommendations from "../molecules/movie-recom";
import PreferenceProfile from "./preference-profile";
import {
  getUserMovieRatings,
  getUserGenreRatings,
} from "@/services/in-app/users";
import { Suspense } from "react";

export async function ABRCBFSection({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userMovieRatingsLength = await getUserMovieRatings().then(
    (res) => res.data.length,
  );
  const diversity = searchParams?.dp ? +searchParams.dp : undefined;
  const userGenreRatingsLength = await getUserGenreRatings().then(
    (res) => Object.keys(res.data).length,
  );
  return (
    <section className="mx-auto flex w-full max-w-[2000px] flex-col gap-4 p-4">
      <section className="max-w-md self-end text-right">
        <h2 className="text-xl font-bold">ABR-CBF Recommendations</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Recommendations made by the enhanced Content-based Filtering algorithm
          by Aranzamendez, Bolito, and Rafe.
        </p>
        {userMovieRatingsLength < 5 ? (
          <PreferenceProfile className="mt-2" />
        ) : (
          <>
            <div className="mb-2 mt-4 flex items-center justify-end gap-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Diversity
              </span>
              <DiversityParameter />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Relevance
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Adjust the slide to your desired diversity or relevance of
              recommendations.
            </p>
          </>
        )}
      </section>
      {userMovieRatingsLength < 5 && !userGenreRatingsLength ? (
        <p className="mx-auto max-w-md text-center text-gray-500 dark:text-gray-400">
          You lack the number of items rated. Rate more movies or build your{" "}
          <PreferenceProfile /> to enable the enhanced Content-based Filtering
          recommendations.
        </p>
      ) : (
        <Suspense fallback={<MovieCarouselLoader />}>
          <MovieRecommendations
            algo="abrcbf"
            diversity={diversity}
            movieRatings={userMovieRatingsLength}
            genreRatings={userGenreRatingsLength}
          />
        </Suspense>
      )}
    </section>
  );
}

export async function ABRCBFSpecific({ movieId }: { movieId: string }) {
  return (
    <section className="mx-auto flex w-full max-w-[2000px] flex-col gap-4 p-4">
      <section className="max-w-md self-end text-right">
        <h2 className="text-xl font-bold">ABR-CBF Recommendations</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Similar movies according to the enhanced Content-based Filtering
          algorithm by Aranzamendez, Bolito, and Rafe.
        </p>
      </section>
      <Suspense fallback={<MovieCarouselLoader />}>
        <MovieRecommendations algo="abrcbf" movieId={movieId} />
      </Suspense>
    </section>
  );
}

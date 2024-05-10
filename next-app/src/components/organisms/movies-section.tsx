import PageNav from "../molecules/pagination";
import MovieList from "./movie-list";
import { getMovies, getRatedMovies } from "@/services/in-app/movies";

export default async function MoviesSection({
  searchParams,
  route,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  route?: "profile" | "movies";
}) {
  const limit = (searchParams?.limit as string) ?? 30;
  const page = (searchParams?.page as string) ?? 1;
  const search = (searchParams?.search as string) ?? undefined;

  const movies =
    route == "profile"
      ? await getRatedMovies(+limit, +page, search)
      : await getMovies(+limit, +page, search);
  return (
    <PageNav {...movies.pagination}>
      <MovieList data={movies.data} />
    </PageNav>
  );
}

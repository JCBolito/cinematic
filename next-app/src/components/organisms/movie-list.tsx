import MovieCard from "../molecules/movie-card";
import { movies } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

type T_Movies = {
  data: InferSelectModel<typeof movies>[] | never[];
};

export default function MovieList({ data }: T_Movies) {
  return (
    <section
      id="movieList"
      className="flex max-w-[2000px] flex-wrap justify-center gap-4 self-center p-4"
    >
      {data?.map((data) => <MovieCard key={data.movieId} movie={data} />)}
    </section>
  );
}

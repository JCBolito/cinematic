import { Badge } from "../ui/badge";
import { movies } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

interface T_MovieType extends InferSelectModel<typeof movies> {
  similarity_score?: number;
}
type T_MovieCard = {
  movie: T_MovieType;
};
export default function MovieCard(props: T_MovieCard) {
  const percentage = props.movie.similarity_score
    ? `${(props.movie.similarity_score * 100).toFixed(0)}% Similar`
    : "";
  return (
    <Link
      target="_top"
      id={`${props.movie.movieId}`}
      href={{
        pathname: `/movies/${props.movie.movieId}`,
      }}
    >
      <div className="group relative inset-0 z-10 cursor-pointer overflow-hidden rounded-lg">
        <img
          alt="Movie poster"
          className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
          height={600}
          src={props.movie.poster}
          width={400}
        />
        <div className="absolute inset-0 flex translate-y-full transform flex-col items-center justify-center gap-2 p-4 text-center transition-transform group-hover:translate-y-0">
          <div className="absolute inset-0 -z-10 bg-black opacity-80" />
          <div className="flex flex-col gap-2 text-sm font-semibold text-white">
            <span className="text-lg font-bold leading-5">
              {props.movie.title}
            </span>
            <span>{new Date(props.movie.release_date).getFullYear()}</span>
            <span className="flex flex-wrap justify-center gap-1">
              {props.movie.genres.map((genre) => (
                <Badge key={genre} variant="custom">
                  {genre}
                </Badge>
              ))}
            </span>
            <span className="mt-4">{percentage}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

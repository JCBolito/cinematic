import { movies, ratings } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

export type T_MovieAndRating = {
  movies: InferSelectModel<typeof movies>;
  ratings: InferSelectModel<typeof ratings> | null;
};

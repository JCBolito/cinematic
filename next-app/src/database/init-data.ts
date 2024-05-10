"use server";

import { db } from ".";
import * as schema from "./schema";
import { InferSelectModel, and, eq, isNull } from "drizzle-orm";

export async function loadMovies(
  movieData: InferSelectModel<typeof schema.movies>,
) {
  try {
    await db.insert(schema.movies).values({
      movieId: movieData.movieId,
      title: movieData.title,
      genres: movieData.genres,
      release_date: movieData.release_date,
      keywords: movieData.keywords,
      poster: movieData.poster,
      overview: movieData.overview,
      runtime: movieData.runtime,
      popularity: movieData.popularity,
      vote_average: movieData.vote_average,
      vote_count: movieData.vote_count,
      video: movieData.video,
    });
    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e,
    };
  }
}

export async function updateVideo(
  movieData: InferSelectModel<typeof schema.movies>,
) {
  try {
    await db
      .update(schema.movies)
      .set({ video: movieData.video })
      .where(
        and(
          eq(schema.movies.movieId, movieData.movieId),
          isNull(schema.movies.video),
        ),
      );

    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e,
    };
  }
}

export async function updateKeywords(id: number, keywords: string[]) {
  try {
    await db
      .update(schema.movies)
      .set({ keywords: keywords })
      .where(eq(schema.movies.movieId, id));

    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e,
    };
  }
}

export async function loadGenres(
  genre: InferSelectModel<typeof schema.genres>,
) {
  try {
    await db.insert(schema.genres).values({
      id: genre.id,
      name: genre.name,
    });
    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e,
    };
  }
}

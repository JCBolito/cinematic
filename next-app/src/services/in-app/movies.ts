"use server";

import { getSession } from "./token";
import { db } from "@/database";
import { movies, ratings, genres, preferences } from "@/database/schema";
import {
  sql,
  ilike,
  or,
  eq,
  and,
  desc,
  asc,
  getTableColumns,
} from "drizzle-orm";

export async function getMovies(
  limit: number = 20,
  page: number = 1,
  search?: string,
) {
  try {
    let data;
    let pagination;
    if (search) {
      data = await db
        .select()
        .from(movies)
        .where(
          or(
            ilike(movies.title, `%${search}%`),
            ilike(movies.overview, `%${search}%`),
          ),
        )
        .orderBy(desc(movies.popularity))
        .limit(limit)
        .offset(limit * (page - 1));

      pagination = await db
        .select({ totalCount: sql<number>`cast(count(*) as integer)` })
        .from(movies)
        .where(
          or(
            ilike(movies.title, `%${search}%`),
            ilike(movies.overview, `%${search}%`),
          ),
        );
    } else {
      data = await db
        .select()
        .from(movies)
        .limit(limit)
        .offset(limit * (page - 1))
        .orderBy(desc(movies.popularity));

      pagination = await db
        .select({ totalCount: sql<number>`cast(count(*) as integer)` })
        .from(movies);
    }
    return {
      success: true,
      data: data,
      pagination: {
        limit: limit,
        currentPage: page,
        totalCount: pagination[0].totalCount,
        totalPages: Math.ceil(pagination[0].totalCount / limit),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: [],
      pagination: {
        limit: limit,
        currentPage: page,
        totalPages: 1,
        totalCount: 0,
      },
      error: e,
    };
  }
}

export async function getGenres() {
  let data;
  const session = await getSession();
  try {
    data = await db
      .select()
      .from(genres)
      .leftJoin(
        preferences,
        and(
          eq(preferences.genreId, genres.id),
          eq(preferences.username, session?.username ?? ""),
        ),
      )
      .orderBy(asc(genres.id));
    return {
      success: true,
      data: data,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: [],
      error: e,
    };
  }
}

export async function getRatedMovies(
  limit: number = 20,
  page: number = 1,
  search?: string,
  username?: string,
) {
  try {
    let data;
    const session = await getSession();
    let pagination;
    if (search) {
      data = await db
        .select(getTableColumns(movies))
        .from(movies)
        .where(
          or(
            ilike(movies.title, `%${search}%`),
            ilike(movies.overview, `%${search}%`),
          ),
        )
        .innerJoin(
          ratings,
          and(
            eq(ratings.movieId, movies.movieId),
            eq(ratings.username, username ?? session?.username ?? ""),
          ),
        )
        .orderBy(desc(ratings.ratedAt))
        .limit(limit)
        .offset(limit * (page - 1));

      pagination = await db
        .select({ totalCount: sql<number>`cast(count(*) as integer)` })
        .from(movies)
        .where(
          or(
            ilike(movies.title, `%${search}%`),
            ilike(movies.overview, `%${search}%`),
          ),
        )
        .innerJoin(
          ratings,
          and(
            eq(ratings.movieId, movies.movieId),
            eq(ratings.username, username ?? session?.username ?? ""),
          ),
        );
    } else {
      data = await db
        .select(getTableColumns(movies))
        .from(movies)
        .innerJoin(
          ratings,
          and(
            eq(ratings.movieId, movies.movieId),
            eq(ratings.username, username ?? session?.username ?? ""),
          ),
        )
        .orderBy(desc(ratings.ratedAt))
        .limit(limit)
        .offset(limit * (page - 1));

      pagination = await db
        .select({ totalCount: sql<number>`cast(count(*) as integer)` })
        .from(movies)
        .innerJoin(
          ratings,
          and(
            eq(ratings.movieId, movies.movieId),
            eq(ratings.username, username ?? session?.username ?? ""),
          ),
        );
    }
    return {
      success: true,
      data: data,
      pagination: {
        limit: limit,
        currentPage: page,
        totalCount: pagination[0].totalCount,
        totalPages: Math.ceil(pagination[0].totalCount / limit),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: [],
      pagination: {
        limit: limit,
        currentPage: page,
        totalPages: 1,
        totalCount: 0,
      },
      error: e,
    };
  }
}

export async function getMovieById(id: number) {
  const session = await getSession();
  const data = await db
    .select()
    .from(movies)
    .where(eq(movies.movieId, id))
    .leftJoin(
      ratings,
      and(
        eq(ratings.movieId, movies.movieId),
        eq(ratings.username, session?.username ?? ""),
      ),
    );
  if (!data) throw new Error("Movie ID does not exist!");
  return {
    success: true,
    data: data,
  };
}

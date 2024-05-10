"use server";

import { db } from "@/database";
import { movies } from "@/database/schema";
import { sql, getTableColumns } from "drizzle-orm";

export async function getFastTextMovies() {
  const data = await db
    .select({
      ...getTableColumns(movies),
      keywords: sql<
        string[]
      >`array(select regexp_replace(element, ' ', '', 'g') from unnest(${movies.keywords}) as element)`,
      genres: sql<
        string[]
      >`array(select regexp_replace(element, ' ', '', 'g') from unnest(${movies.genres}) as element)`,
    })
    .from(movies);
  return {
    success: true,
    data: data,
  };
}

export async function getAllKeywords() {
  const data = await db
    .select({ keywords: sql<string>`distinct unnest(${movies.keywords})` })
    .from(movies);

  const combinedData = data.map((data) => data.keywords);
  const noWhitespace = combinedData.map((word) => word.replaceAll(" ", ""));
  return {
    success: true,
    data: noWhitespace,
  };
}

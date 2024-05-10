"use server";

import { getSession } from "./token";
import { db } from "@/database";
import { preferences } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function rateGenre(rating: number, id: number) {
  try {
    const session = await getSession();
    if (session) {
      await db
        .insert(preferences)
        .values({
          id: `G${id}-U${session.id}`,
          genreId: id,
          username: session.username,
          rating: rating,
        })
        .onConflictDoUpdate({
          target: preferences.id,
          set: { rating: rating },
        });
      revalidateTag("tpp-recom");
      return {
        success: true,
        message: `You rated this genre ${rating} stars!`,
      };
    } else throw new Error("No user session.");
  } catch (e) {
    return {
      success: false,
      message: "Failed to rate the movie.",
      error: `${e}`,
    };
  }
}

export async function clearGenreRating(id: number) {
  try {
    const session = await getSession();
    if (session) {
      await db
        .delete(preferences)
        .where(eq(preferences.id, `G${id}-U${session.id}`));
    }
    revalidateTag("tpp-recom");
    return {
      success: true,
      message: `You deleted your rating for this movie.`,
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed to rate the movie.",
      error: `${e}`,
    };
  }
}

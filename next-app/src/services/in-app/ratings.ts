"use server";

import { getSession } from "./token";
import { db } from "@/database";
import { ratings } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function rate(rating: number, movieId: number) {
  try {
    const session = await getSession();
    if (session) {
      await db
        .insert(ratings)
        .values({
          id: `M${movieId}-U${session.id}`,
          username: session.username,
          movieId: movieId,
          rating: rating,
        })
        .onConflictDoUpdate({
          target: ratings.id,
          set: { rating: rating },
        });
      revalidateTag("cbf-recom");
      revalidateTag("abrcbf-recom");
      return {
        success: true,
        message: `You rated this movie ${rating} stars!`,
      };
    } else throw new Error("No user session!");
  } catch (e) {
    return {
      success: false,
      message: "Failed to rate the movie.",
      error: `${e}`,
    };
  }
}

export async function clearRating(movieId: number) {
  try {
    const session = await getSession();
    if (session) {
      await db
        .delete(ratings)
        .where(eq(ratings.id, `M${movieId}-U${session.id}`));
    }
    revalidateTag("cbf-recom");
    revalidateTag("abrcbf-recom");
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

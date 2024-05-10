"use server";

import { getSession } from "./in-app/token";
import { movies } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";
import { revalidateTag } from "next/cache";

// [OG] Content-based Filtering
export async function getCbfRecom() {
  try {
    const session = await getSession();
    const res = await fetch(
      `${process.env.FASTAPI_URL}/cbf/${session?.username}`,
      {
        cache: "force-cache",
        next: { tags: ["cbf-recom"] },
      },
    );
    const data = await res.json();
    return {
      success: true,
      data: data.data as InferSelectModel<typeof movies>[],
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      error: `${e}`,
    };
  }
}

export async function getSpecificCbfRecom(movieId: string) {
  try {
    const res = await fetch(
      `${process.env.FASTAPI_URL}/cbf-similar/${movieId}`,
      //   {
      // 	cache: "force-cache",
      // 	next: { tags: ["cbf-recom"] },
      //   },
    );
    const data = await res.json();
    return {
      success: true,
      data: data.data as InferSelectModel<typeof movies>[],
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      error: `${e}`,
    };
  }
}

// [ENHANCED] ABR-CBF
export async function getEnhancedCbfRecom(diversity?: number) {
  const dp = diversity ?? 0.5;
  try {
    const session = await getSession();
    const res = await fetch(
      `${process.env.FASTAPI_URL}/ecbf/${session?.username}/${dp}`,
      {
        cache: "force-cache",
        next: { tags: ["abrcbf-recom"] },
      },
    );
    const data = await res.json();
    return {
      success: true,
      data: data.data as InferSelectModel<typeof movies>[],
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      error: `${e}`,
    };
  }
}

export async function getTemporaryRecom() {
  try {
    const session = await getSession();
    const res = await fetch(
      `${process.env.FASTAPI_URL}/ecbf-tpp/${session?.username}`,
      {
        cache: "force-cache",
        next: { tags: ["tpp-recom"] },
      },
    );
    const data = await res.json();
    return {
      success: true,
      data: data.data as InferSelectModel<typeof movies>[],
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      error: `${e}`,
    };
  }
}

export async function revalidate(tag: string) {
  revalidateTag(tag);
}

export async function getSpecificEcbfRecom(movieId: string) {
  try {
    const res = await fetch(
      `${process.env.FASTAPI_URL}/ecbf-fasttext/${movieId}`,
      //   {
      // 	cache: "force-cache",
      // 	next: { tags: ["cbf-recom"] },
      //   },
    );
    const data = await res.json();
    return {
      success: true,
      data: data.data as InferSelectModel<typeof movies>[],
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      error: `${e}`,
    };
  }
}

"use server";

import { getSession } from "./token";
import { db } from "@/database";
import { preferences, ratings, users, genres } from "@/database/schema";
import { signUpFormSchema, loginFormSchema } from "@/schemas/auth-schema";
import { QueryResult } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const bcryptRounds = 10;

export async function signUp(formData: z.infer<typeof signUpFormSchema>) {
  let data: undefined | QueryResult<never>;
  let message = "";

  try {
    const usernameExists = await db.query.users.findFirst({
      where: eq(users.username, formData.username),
    });
    if (usernameExists) {
      message = "User already exists!";
      throw new Error(message);
    } else {
      const parse = signUpFormSchema.parse(formData);
      bcrypt.hash(parse.password, bcryptRounds, async (err, hash) => {
        if (err) {
          message = "Failed to create an account!";
          throw new Error(message);
        }
        data = await db.insert(users).values({
          firstName: parse.firstName,
          lastName: parse.lastName,
          username: parse.username,
          password: hash,
        });
      });
    }
    return {
      success: true,
      data: data,
      message: "Successfully created an account!",
    };
  } catch (e) {
    return {
      success: false,
      data: data,
      message: message,
      error: `${e}`,
    };
  }
}

export async function login(formData: z.infer<typeof loginFormSchema>) {
  let token: undefined | string;
  let message = "";
  function invalidateCredentaials(errMsg?: string) {
    message = errMsg ?? "Invalid credentials!";
    throw new Error(errMsg);
  }

  try {
    const parse = loginFormSchema.parse(formData);
    const user = await db.query.users.findFirst({
      where: eq(users.username, parse.username),
    });
    if (user) {
      const validCredentials = bcrypt.compareSync(
        parse.password,
        user.password,
      );
      if (validCredentials) {
        token = jwt.sign(user, process.env.JWT_SECRET as string);
        cookies().set(process.env.COOKIE_NAME as string, token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });
        revalidateTag("cbf-recom");
        revalidateTag("abrcbf-recom");
        revalidateTag("tpp-recom");
        return {
          success: true,
          data: token,
          message: "Valid credentials!",
        };
      } else {
        invalidateCredentaials();
      }
    } else {
      invalidateCredentaials();
    }
  } catch (e) {
    return {
      success: false,
      data: token,
      message: message,
      error: `${e}`,
    };
  }
}

export async function logout() {
  try {
    cookies().delete(process.env.COOKIE_NAME as string);
  } catch (e) {
    console.error(e);
    toast.error("Error!", { description: "Unable to logout." });
  }
  redirect("/");
}

export async function getUserMovieRatings(username?: string) {
  let session;
  if (!username) {
    session = await getSession();
  }
  try {
    const data = await db
      .select()
      .from(ratings)
      .where(eq(ratings.username, username ?? session?.username ?? ""));
    return {
      success: true,
      data: data,
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: `${e}`,
    };
  }
}

export async function getUserGenreRatings(username?: string) {
  let newData: { [key: string]: number } = {};
  let session;
  if (!username) {
    session = await getSession();
  }
  try {
    const data = await db
      .select({ genre: genres.name, rating: preferences.rating })
      .from(genres)
      .innerJoin(
        preferences,
        and(
          eq(preferences.genreId, genres.id),
          eq(preferences.username, username ?? session?.username ?? ""),
        ),
      );
    data.map((obj) => {
      newData[obj.genre] = obj.rating;
    });
    return {
      success: true,
      data: newData,
    };
  } catch (e) {
    return {
      success: false,
      data: [],
      message: `${e}`,
    };
  }
}

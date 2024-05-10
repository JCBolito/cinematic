"use server";

import { users } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getSession() {
  const token = cookies().get(process.env.COOKIE_NAME as string)?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      if (decoded) {
        return decoded as InferSelectModel<typeof users>;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

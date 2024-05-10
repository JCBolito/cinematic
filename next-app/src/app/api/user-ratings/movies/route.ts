import { getUserMovieRatings } from "@/services/in-app/users";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username") ?? "";
  console.log(username);
  const data = await getUserMovieRatings(username);
  return Response.json(data);
}

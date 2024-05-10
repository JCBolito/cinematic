import { getRatedMovies } from "@/services/in-app/movies";
import { NextRequest } from "next/server";

type Params = {
  page?: string;
  limit?: string;
};

export async function GET(request: NextRequest, params: Params) {
  const limit = request.nextUrl.searchParams.get("limit") ?? 30;
  const page = request.nextUrl.searchParams.get("page") ?? 1;
  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const data = await getRatedMovies(+limit, +page, search);
  return Response.json(data);
}

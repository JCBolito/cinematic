import { getFastTextMovies } from "@/services/in-app/fasttext-data";
import { NextRequest } from "next/server";

type Params = {
  page?: string;
  limit?: string;
};

export async function GET(request: NextRequest, params: Params) {
  const data = await getFastTextMovies();
  return Response.json(data);
}

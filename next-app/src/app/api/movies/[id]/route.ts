import { getMovieById } from "@/services/in-app/movies";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await getMovieById(+params.id);
  return Response.json(data);
}

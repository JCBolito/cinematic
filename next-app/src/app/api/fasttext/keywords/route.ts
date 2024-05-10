import { getAllKeywords } from "@/services/in-app/fasttext-data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const data = await getAllKeywords();
  return Response.json(data);
}

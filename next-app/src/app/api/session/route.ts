import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get(process.env.COOKIE_NAME as string)?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      if (decoded) return Response.json({ session: true });
    } catch (e) {
      return Response.json({ session: false });
    }
  }
  return Response.json({ session: false });
}

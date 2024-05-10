import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = cookies().get(process.env.COOKIE_NAME as string);
  const pathname = req.nextUrl.pathname;
  if (
    token &&
    !pathname.includes("/movies") &&
    !pathname.includes("/profile")
  ) {
    return NextResponse.redirect(new URL("/movies", req.url));
  }
  if (
    !token &&
    (pathname.includes("/movies") || pathname.includes("/profile"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/", "/signup", "/movies/:path*", "/profile:path*"],
};

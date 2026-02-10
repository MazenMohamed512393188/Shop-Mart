import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/cart"];

const authRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (token) {
      return NextResponse.next();
    } else {
      const redirectUrl = new URL("/login", process.env.LOCALHOST);
      redirectUrl.searchParams.set("url", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (authRoutes.includes(req.nextUrl.pathname)) {

    if (token) {
      const redirectUrl = new URL("/", process.env.LOCALHOST);
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

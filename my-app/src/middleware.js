import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES } from "./roles/roles";
// Without a defined matcher, this one line applies next-auth to entire project
// export { default } from "next-auth/middleware"

export const ADMIN_ROUTES = ["/admin"];

export const ORG_ADMIN_ROUTES = ["/organization"];

export const MEMBER_ROUTES = [
  "/data-insights",
  "/events",
  "/home",
  "/thread",
  "/threads",
];

export default withAuth(
  function middleware(request) {
    // console.log("middleware", request.nextauth.token);
    // If the user's role is not admin, redirect to the denied page
    if (
      ADMIN_ROUTES.some((path) => request.nextUrl.pathname.startsWith(path)) &&
      request.nextauth.token?.role !== ROLES.ADMIN
    ) {
      console.log("hello admin");
      return NextResponse.rewrite(new URL("/denied", request.url));
    }

    if (
      ORG_ADMIN_ROUTES.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      ) &&
      request.nextauth.token?.role !== ROLES.ORG_ADMIN &&
      request.nextauth.token?.role !== ROLES.ADMIN
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
    // If there isn't a token, then user can't access item page
    // if (
    //   request.nextUrl.pathname.startsWith("/items") &&
    //   !request.nextauth.token?.role
    // ) {
    //   return NextResponse.rewrite(new URL("/denied", request.url));
    // }
  },
  {
    callbacks: {
      authorize: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/uploadthing|).*)",
    "/admin/:path*",
    "/events",
    "/event/:path*",
    "/home",
    "/organization",
    "/data-insights",
    "/thread",
    "/threads",
    "/api/mongo/thread/:path*",
    "/api/mongo/organization/:path*",
    "/api/mongo/sorted-material/:path*",
    "/api/mongo/user/:path*",
    "/api/mongo/event/id/:path*",
    "/api/mongo/event/island/:path*",
    "/api/mongo/event/removal-org-id/:path*",
    "/api/mongo/event/status/:path*",
    "/api/mongo/event/storage-node/:path*",
    "/api/mongo/event/transport/:path*",
    // "/api/mongo/event/all"
  ],
};

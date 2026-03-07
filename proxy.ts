import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { COOKIE_OPTIONS } from "@/lib/supabase/constants";

const PUBLIC_PATHS = ["/login", "/signup", "/api/signup"];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some((path) => pathname.startsWith(path));

export const proxy = async (request: NextRequest) => {
  const ref = { response: NextResponse.next({ request }) };

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          ref.response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            ref.response.cookies.set(name, value, { ...options, ...COOKIE_OPTIONS })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    ref.response.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie)
    );
    return redirectResponse;
  }

  return ref.response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

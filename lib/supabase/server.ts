import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS } from "./constants";

/** Server Action / Route Handler 用（cookie 読み書き可） */
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...options, ...COOKIE_OPTIONS })
          ),
      },
    }
  );
};

/** Server Component 用（読み取り専用、トークンリフレッシュは proxy に委譲） */
export const createReadonlyClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // Server Component では cookie 書き込み不可。
        // トークンリフレッシュは proxy が毎リクエスト担保するため、ここでは不要。
        // 注意: setAll を省略すると SDK が console.warn を出すフォールバックに差し替えるため、
        // 意図的に空関数を渡している。
        setAll: () => {},
      },
    }
  );
};

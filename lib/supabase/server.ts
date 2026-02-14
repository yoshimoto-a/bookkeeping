import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./config";

export const createServerSupabaseClient = (cookies: CookieMethodsServer) =>
  createServerClient(supabaseUrl, supabaseAnonKey, { cookies });

const getCookieStore = async () => {
  const cookieStore = await cookies();
  return {
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet: { name: string; value: string; options: object }[]) =>
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options)
      ),
  };
};

/** Server Action / Route Handler 用（cookie 書き込み可） */
export const createClient = async () => {
  const { getAll, setAll } = await getCookieStore();
  return createServerSupabaseClient({ getAll, setAll });
};

/** Server Component 用（cookie 読み取り専用） */
export const createReadonlyClient = async () => {
  const { getAll } = await getCookieStore();
  return createServerSupabaseClient({ getAll });
};

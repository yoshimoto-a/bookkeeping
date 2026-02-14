import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./config";

export const createServerSupabaseClient = (cookies: CookieMethodsServer) =>
  createServerClient(supabaseUrl, supabaseAnonKey, { cookies });

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {
        // Called from a Server Component — ignore.
      }
    },
  });
};

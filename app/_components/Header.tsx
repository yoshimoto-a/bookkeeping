import Link from "next/link";
import { createReadonlyClient } from "@/lib/supabase/server";
import { AuthedHeader } from "./HeaderContent";

export const Header = async () => {
  const supabase = await createReadonlyClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b">
      <Link href="/" className="font-bold text-lg">
        Bookkeeping
      </Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <AuthedHeader email={user.email ?? ""} />
        ) : (
          <>
            <Link href="/login" className="text-sm hover:underline">
              サインイン
            </Link>
            <Link
              href="/signup"
              className="text-sm px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
            >
              サインアップ
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

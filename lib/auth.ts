import { redirect } from "next/navigation";
import { createReadonlyClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const getAuthenticatedUser = async () => {
  const supabase = await createReadonlyClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return { id: dbUser.id, supabaseId: dbUser.supabaseId };
};

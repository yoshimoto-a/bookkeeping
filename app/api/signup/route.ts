import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ACCOUNT_TEMPLATES } from "@/lib/constants/accountTemplates";
import type {
  AuthFormData,
  SignupResponse,
  SignupErrorResponse,
} from "@/app/_types/auth";

export const POST = async (request: Request) => {
  try {
    const { email, password }: AuthFormData = await request.json();

    const supabase = await createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json<SignupErrorResponse>(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    const supabaseId = data.user?.id;
    if (!supabaseId) {
      return NextResponse.json<SignupErrorResponse>(
        { error: "ユーザーの作成に失敗しました" },
        { status: 500 }
      );
    }

    const user = await prisma.user.create({
      data: { supabaseId, email },
    });

    await prisma.account.createMany({
      data: ACCOUNT_TEMPLATES.map((t) => ({
        userId: user.id,
        ...t,
      })),
    });

    return NextResponse.json<SignupResponse>(
      { success: true },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<SignupErrorResponse>(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};

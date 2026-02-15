"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema, type AuthFormData } from "@/app/_types/auth";
import { login } from "./actions";
import { TextInput } from "@/app/_components/TextInput";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { SecondaryLink } from "@/app/_components/SecondaryLink";
import { FormError } from "@/app/_components/FormError";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (body: AuthFormData) => {
    const result = await login(body);
    if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex w-80 flex-col items-center gap-6 rounded-lg border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          ログイン
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          <div>
            <TextInput {...register("email")} type="email" placeholder="メールアドレス" disabled={isSubmitting} />
            <FormError message={errors.email?.message} />
          </div>
          <div>
            <TextInput {...register("password")} type="password" placeholder="パスワード" disabled={isSubmitting} />
            <FormError message={errors.password?.message} />
          </div>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </PrimaryButton>
          <SecondaryLink href="/signup">新規登録</SecondaryLink>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

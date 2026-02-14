import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export const signupSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

export type AuthFormData = {
  email: string;
  password: string;
};

export type SignupResponse = {
  success: true;
};

export type SignupErrorResponse = {
  error: string;
};

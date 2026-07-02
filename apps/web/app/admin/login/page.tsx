"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, useToast } from "@repo/ui";
import { Lock, Mail, ShieldAlert } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        const errorMsg = res.error === "CredentialsSignin"
          ? "Invalid email or password"
          : res.error;
        toastError(errorMsg, "Login Failed");
      } else {
        toastSuccess("Welcome back to the Admin Dashboard!", "Access Granted");
        window.location.href = "/admin/dashboard";
      }
    } catch (err: any) {
      toastError(err?.message || "An unexpected error occurred", "System Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 via-blue-100 to-orange-200 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-primary/5 dark:shadow-slate-950 glass">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Sign in to manage product lists, clicks, and affiliate store analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@affiliate.com"
                  className="pl-10 bg-slate-50/50 dark:bg-slate-900/50"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-slate-50/50 dark:bg-slate-900/50"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white shadow-lg shadow-primary/20 py-6 text-base font-semibold"
              loading={loading}
            >
              Authenticate
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-2 pb-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-900">
          <p>Local offline credentials:</p>
          <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-primary font-mono">
            admin@affiliate.com / admin123
          </code>
        </CardFooter>
      </Card>
    </div>
  );
}

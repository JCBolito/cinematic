"use client";

import { T_SignUpFormInput } from "./signup/page";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useLogin from "@/hooks/useLogin";
import { Film } from "lucide-react";
import Link from "next/link";

interface T_LoginFormInput extends Partial<T_SignUpFormInput> {
  name: "username" | "password";
  label: string;
}

const formInputs: T_LoginFormInput[] = [
  { name: "username", label: "Username" },
  { name: "password", label: "Password", type: "password" },
];

export default function Login() {
  const { form, onSubmit } = useLogin();

  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-lg space-y-6 p-4"
        >
          <div className="mb-8 space-y-2 text-center">
            <Film size={50} className="m-auto" />
            <h1 className="text-3xl font-bold">Welcome to Cinematic</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your username and password to access your account.
            </p>
          </div>
          {formInputs.map((input, index) => (
            <FormField
              key={index}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-4 items-center justify-between">
                    <FormLabel>{input.label}</FormLabel>
                    <FormMessage className="text-xs dark:text-red-500" />
                  </div>
                  <FormControl>
                    <Input
                      type={input.type}
                      placeholder={input.placeholder}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Separator />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/signup">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </main>
  );
}

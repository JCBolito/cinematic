"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useSignUp from "@/hooks/useSignUp";
import { Film } from "lucide-react";
import Link from "next/link";

export interface T_SignUpFormInput extends Partial<InputProps> {
  name:
    | "username"
    | "password"
    | "firstName"
    | "lastName"
    | "confirmUsername"
    | "confirmPassword";
  label: string;
}

const formInputs: T_SignUpFormInput[] = [
  { name: "firstName", label: "First Name", placeholder: "Walter" },
  { name: "lastName", label: "Last Name", placeholder: "White" },
  { name: "username", label: "Username", placeholder: "Heisenberg" },
  { name: "confirmUsername", label: "Confirm Username" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

export default function SignUp() {
  const { form, onSubmit } = useSignUp();

  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-lg space-y-6 p-4"
        >
          <div className="mb-8 space-y-2 text-center">
            <Film size={50} className="m-auto" />
            <h1 className="text-3xl font-bold">Sign Up to Cinematic</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter the required information to create an account
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
            Sign Up
          </Button>
          <Separator />
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link className="underline" href="/">
              Login
            </Link>
          </div>
        </form>
      </Form>
    </main>
  );
}

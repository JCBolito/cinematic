import { loginFormSchema } from "@/schemas/auth-schema";
import { login } from "@/services/in-app/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type T_LoginHook = {
  form: UseFormReturn<
    {
      username: string;
      password: string;
    },
    any,
    undefined
  >;
  onSubmit: (values: z.infer<typeof loginFormSchema>) => Promise<void>;
};
export default function useLogin(): T_LoginHook {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const res = await login(values);
    if (res?.success) {
      router.replace("/movies");
      toast.success("Success!", { description: res.message });
    } else {
      toast.error("Error!", { description: res?.message });
    }
  }
  return { form, onSubmit };
}

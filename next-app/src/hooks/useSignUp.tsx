import { signUpFormSchema } from "@/schemas/auth-schema";
import { signUp } from "@/services/in-app/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type T_SignUpHook = {
  form: UseFormReturn<
    {
      firstName: string;
      lastName: string;
      username: string;
      confirmUsername: string;
      password: string;
      confirmPassword: string;
    },
    any,
    undefined
  >;
  onSubmit: (values: z.infer<typeof signUpFormSchema>) => Promise<void>;
};
export default function useSignUp(): T_SignUpHook {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });
  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    const res = await signUp(values);
    if (res.success) {
      router.push("/");
      toast.success("Success!", { description: res.message });
    } else {
      toast.error("Error!", { description: res?.message });
    }
  }
  return { form, onSubmit };
}

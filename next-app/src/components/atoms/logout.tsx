"use client";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { logout } from "@/services/in-app/users";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type T_LogoutButton = {
  type?: "icon";
  className?: string;
  asChild?: boolean;
};

export default function Logout({ ...props }: T_LogoutButton) {
  if (props.type) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className={props.className}>
            <LogOut size={18} />
            <span className={cn(props.type && "sr-only")}>Logout</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              Logging out will end your current session. Are you sure you want
              to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LogoutButton />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return <LogoutButton {...props} />;
  }
}

function LogoutButton({ ...props }: T_LogoutButton) {
  const router = useRouter();
  async function handleLogout() {
    await logout();
    router.replace("/");
  }
  return (
    <form className={props.className} action={() => handleLogout()}>
      <Button
        className={cn(props.className, "space-x-1")}
        variant={props.type ? "ghost" : "destructive"}
        size={props.type ?? "default"}
        asChild={props.asChild}
      >
        <LogOut size={18} />
        <span className={cn(props.type && "sr-only")}>Logout</span>
      </Button>
    </form>
  );
}

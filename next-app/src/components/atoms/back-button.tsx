"use client";

import { Button } from "../ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button size="icon" variant="ghost" onClick={() => router.back()}>
      <MoveLeft />
      <span className="sr-only">Back</span>
    </Button>
  );
}

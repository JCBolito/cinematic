"use client";

import StarIcon from "../atoms/star-icon";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type T_StarRatingProps = {
  className?: string;
  id: number;
  currentRating?: number | null;
  rateHandler: (
    value: number,
    id: number,
  ) => Promise<{ success: boolean; message: string }>;
  clearRatingHandler: (
    id: number,
  ) => Promise<{ success: boolean; message: string }>;
};
export default function StarRating({ ...props }: T_StarRatingProps) {
  const router = useRouter();
  const stars = [5, 4, 3, 2, 1];

  const [hover, setHover] = useState(false);

  async function handleClearRating() {
    const res = await props.clearRatingHandler(props.id);
    if (res?.success) {
      toast.success("Success!", { description: res.message });
      router.refresh();
    } else toast.error("Error!", { description: res?.message });
  }

  return (
    <section
      className={cn(
        "flex flex-col items-center gap-2 sm:flex-row",
        props.className,
      )}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex w-fit flex-row-reverse"
      >
        {stars.map((value) => (
          <Star
            key={value}
            value={value}
            id={props.id}
            filled={!hover && value <= (props.currentRating ?? 0)}
            rateHandler={props.rateHandler}
          />
        ))}
      </div>
      {props.currentRating && (
        <form action={handleClearRating} className="w-fit">
          <Button variant="link" className="h-auto p-0">
            Clear Rating
          </Button>
        </form>
      )}
    </section>
  );
}

function Star({
  ...props
}: {
  value: number;
  filled?: boolean;
  id: number;
  rateHandler: (
    value: number,
    id: number,
  ) => Promise<{ success: boolean; message: string }>;
}) {
  const router = useRouter();
  async function handleRating() {
    const res = await props.rateHandler(props.value, props.id);
    if (res.success) {
      toast.success("Success!", { description: res.message });
      router.refresh();
    } else toast.error("Error!", { description: res?.message });
  }
  return (
    <form
      action={handleRating}
      className={cn(
        "flex items-center px-1",
        props.filled
          ? "[&_*]:fill-black [&_*]:dark:fill-white"
          : `peer [&_*]:hover:fill-neutral-900  [&_*]:peer-hover:fill-neutral-900 
		  [&_*]:dark:fill-neutral-900 [&_*]:dark:hover:fill-white 
		  [&_*]:dark:peer-hover:fill-white`,
      )}
    >
      <button>
        <StarIcon className="h-6 w-6" />
      </button>
    </form>
    // <StarIcon className="peer h-6 w-6 hover:fill-neutral-900 peer-hover:fill-neutral-900 dark:fill-neutral-900 dark:hover:fill-white dark:peer-hover:fill-white" />
  );
}

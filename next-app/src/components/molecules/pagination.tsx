"use client";

import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { generatePagination } from "@/services/in-app/pagination";
import { MoveLeft, MoveRight } from "lucide-react";
import { Clapperboard } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type T_PaginationProps = {
  className?: string;
  totalCount: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  children?: React.ReactNode;
  emptyMessage?: string;
};
export default function PageNav({ ...props }: T_PaginationProps) {
  if (props.totalCount > 0) {
    return (
      <>
        <PaginationComponent {...props} />
        {props.children}
        <PaginationComponent {...props} className="mb-16" />
      </>
    );
  } else {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center p-4 sm:my-16",
          props.className,
        )}
      >
        <Clapperboard size={120} />
        <p className="text-center text-xl">
          {props.emptyMessage ?? "We can't find what you're looking for."}
        </p>
      </div>
    );
  }
}

function PaginationComponent({
  ...props
}: Omit<T_PaginationProps, "children">) {
  const params = new URLSearchParams(useSearchParams());
  const router = useRouter();

  function getPage(page: number) {
    if (page < 1 || page > props.totalPages) return;
    params.set("page", page.toString());
    params.delete("focus");
    params.delete("origin");
    router.push(`?${params}`, { scroll: false });
  }

  useEffect(() => {
    if (props.currentPage < 1) params.set("page", "1");
    else if (props.currentPage > props.totalPages) params.set("page", "1");
    if (props.limit < 1) params.set("limit", "30");
    router.push(`?${params}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pagination className={props.className}>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => getPage(props.currentPage - 1)}
            size="sm"
            disabled={props.currentPage == 1}
          >
            <MoveLeft size={18} />
            <span className="sr-only">Go to previous page</span>
          </Button>
        </PaginationItem>
        {generatePagination(props.totalPages, props.currentPage, 5).map(
          (page, index) => (
            <PaginationItem key={index}>
              <Button
                variant={props.currentPage == page ? "default" : "ghost"}
                onClick={() => getPage(page)}
                size="sm"
              >
                <span className="sr-only">Go to page # </span>
                {page}
              </Button>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => getPage(props.currentPage + 1)}
            size="sm"
            disabled={props.currentPage == props.totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <MoveRight size={18} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

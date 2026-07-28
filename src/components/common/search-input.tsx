"use client";

import { Input } from "@/components/ui/input";
import { Icon } from "@/components/common/icon";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type SearchInputProps = Omit<ComponentProps<"input">, "type"> & {
  containerClassName?: string;
};

/** Shared search field with leading icon. */
export function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Icon
        name="search"
        size={16}
        className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        className={cn(
          "h-10 border-transparent bg-muted shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-muted",
          "ps-9",
          className,
        )}
        {...props}
      />
    </div>
  );
}

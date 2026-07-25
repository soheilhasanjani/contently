"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

type DocumentAttributesProps = {
  locale: string;
  direction: "ltr" | "rtl";
  fontClassName: string;
};

/** Keeps `<html>` lang/dir/font in sync when locale lives under `[locale]`. */
export function DocumentAttributes({
  locale,
  direction,
  fontClassName,
}: DocumentAttributesProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = direction;
    root.className = cn("h-full", fontClassName);
  }, [locale, direction, fontClassName]);

  return null;
}

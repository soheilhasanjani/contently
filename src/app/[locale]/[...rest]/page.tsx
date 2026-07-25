import { notFound } from "next/navigation";

/** Triggers `[locale]/not-found.tsx` for unknown paths under a valid locale. */
export default function CatchAllPage() {
  notFound();
}

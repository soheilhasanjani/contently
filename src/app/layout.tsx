import type { ReactNode } from "react";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

/** Required by Next.js; the real app shell lives under `[locale]/layout`. */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}

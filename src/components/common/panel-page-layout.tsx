import { cn } from "@/lib/utils";

type PanelPageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/** Nested content layout for panel feature pages (clears fixed top bar). */
export function PanelPageLayout({ children, className }: PanelPageLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl space-y-8 px-6 pt-6 pb-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

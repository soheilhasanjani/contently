"use client";

import { PanelSidebar } from "@/features/panel/components/panel-sidebar";
import { PanelTopBar } from "@/features/panel/components/panel-top-bar";

type PanelShellProps = {
  children: React.ReactNode;
};

export function PanelShell({ children }: PanelShellProps) {
  return (
    <>
      <PanelTopBar />
      <PanelSidebar />
      <main className="min-h-svh min-w-0 ps-64 pt-16">{children}</main>
    </>
  );
}

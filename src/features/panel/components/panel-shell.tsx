"use client";

import { PanelSidebar } from "@/features/panel/components/panel-sidebar";
import { PanelTopBar } from "@/features/panel/components/panel-top-bar";

type PanelShellProps = {
  children: React.ReactNode;
};

export function PanelShell({ children }: PanelShellProps) {
  return (
    <div className="flex min-h-full flex-1">
      <PanelSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelTopBar />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

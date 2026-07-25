"use client";

import { PanelSidebar } from "@/features/panel/components/panel-sidebar";
import { PanelTopBar } from "@/features/panel/components/panel-top-bar";

type PanelShellProps = {
  children: React.ReactNode;
};

export function PanelShell({ children }: PanelShellProps) {
  return (
    <div className="min-h-svh flex-1">
      <PanelSidebar />
      <PanelTopBar />
      <div className="h-svh ps-64 pt-14">
        <div className="scroll-fade-t h-full overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

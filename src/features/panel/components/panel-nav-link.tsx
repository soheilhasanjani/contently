"use client";

import { Icon, type IconName } from "@/components/common/icon";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type PanelNavLinkProps = {
  href: string;
  label: string;
  icon: IconName;
  badgeCount?: number;
};

export function sidebarNavItemClassName(active = false) {
  return cn(
    "flex cursor-pointer items-center gap-2.5 rounded-[20px] border border-transparent p-[5px] ps-3 text-sm font-medium leading-6 tracking-normal transition-[background-color,border] duration-150",
    active
      ? "bg-sidebar-nav-active-background text-sidebar-nav-active-foreground"
      : "text-sidebar-nav-foreground hover:bg-sidebar-nav-hover-background hover:text-sidebar-nav-hover-foreground",
  );
}

export function PanelNavLink({
  href,
  label,
  icon,
  badgeCount,
}: PanelNavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={sidebarNavItemClassName(active)}>
      <Icon name={icon} size={20} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-start">{label}</span>
      {badgeCount != null && badgeCount > 0 ? (
        <span className="inline-flex min-w-5 me-2 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold leading-4 text-white">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
    </Link>
  );
}

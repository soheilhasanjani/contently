import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

/** Material Symbols Rounded ligatures used in the app. Add names here as needed. */
export const ICONS = [
  "add",
  "archive",
  "auto_awesome",
  "calendar_month",
  "cancel",
  "center_focus_strong",
  "check",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "close",
  "create_new_folder",
  "dark_mode",
  "edit",
  "edit_note",
  "grid_view",
  "home",
  "info",
  "keyboard_arrow_down",
  "keyboard_arrow_up",
  "light_mode",
  "newspaper",
  "notifications",
  "person_add",
  "progress_activity",
  "refresh",
  "schedule",
  "search",
  "settings",
  "translate",
  "unarchive",
  "unfold_more",
  "view_list",
  "warning",
] as const;

export type IconName = (typeof ICONS)[number];

export type IconProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  name: IconName;
  /** Pixel size (font-size + optical size). Default 20. */
  size?: number;
  /** Variable font weight 100–700. Default 400. */
  weight?: number;
};

export function Icon({
  name,
  size = 20,
  weight = 400,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: IconProps) {
  const decorative = ariaLabel == null && ariaLabelledBy == null;
  const opsz = Math.min(48, Math.max(20, size));

  return (
    <span
      {...props}
      className={cn("material-symbols-rounded", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' 0, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${opsz}`,
        ...style,
      }}
      aria-hidden={decorative ? true : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {name}
    </span>
  );
}

import { RootProvider } from "@/components/common/root-provider";
import { NotFoundPage } from "@/features/system/pages/not-found-page";
import { routing } from "@/i18n/routing";

/** Fallback when no locale segment is matched (needs its own document shell). */
export default function GlobalNotFound() {
  return (
    <RootProvider locale={routing.defaultLocale}>
      <NotFoundPage />
    </RootProvider>
  );
}

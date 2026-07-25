/** Auth cookie name — JS-readable (not httpOnly). */
export const ACCESS_TOKEN_COOKIE = "access_token";

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

function isBrowser(): boolean {
  return typeof document !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ACCESS_TOKEN_COOKIE}=`));

  if (!match) return null;

  const value = match.slice(ACCESS_TOKEN_COOKIE.length + 1);
  return value ? decodeURIComponent(value) : null;
}

export function setAccessToken(token: string): void {
  if (!isBrowser()) return;

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = [
    `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${SEVEN_DAYS_SECONDS}`,
    secure,
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearAccessToken(): void {
  if (!isBrowser()) return;

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

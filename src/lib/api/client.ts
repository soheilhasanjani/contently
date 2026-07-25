import axios, { type AxiosError } from "axios";
import { getAccessToken } from "@/lib/auth/cookie";
import { env } from "@/lib/env";
import { ApiClientError, mapApiError } from "@/lib/api/error-mapper";
import { routes } from "@/lib/routes";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const mapped = mapApiError(error);

    if (typeof window !== "undefined" && mapped.isUnauthorized) {
      const hasCookie = Boolean(getAccessToken());
      if (hasCookie) {
        const path = routes.unauthorized();
        const localePrefix = window.location.pathname.match(/^\/(en|fa)(?=\/|$)/);
        const locale = localePrefix?.[1] ?? "fa";
        window.location.assign(`/${locale}${path === "/" ? "" : path}`);
      }
    }

    return Promise.reject(new ApiClientError(mapped));
  },
);

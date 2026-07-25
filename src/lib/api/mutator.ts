import type { AxiosError, AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api/client";

/**
 * Orval mutator — generated hooks call this instead of raw axios.
 * @see https://orval.dev/docs/guides/custom-axios
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return apiClient({
    ...config,
    ...options,
  }).then(({ data }) => data as T);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

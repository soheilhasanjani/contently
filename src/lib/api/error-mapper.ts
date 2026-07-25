import axios, { type AxiosError, isAxiosError } from "axios";

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export type MappedApiError = {
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
  isUnauthorized: boolean;
  isForbidden: boolean;
  cause: unknown;
};

function readErrorBody(data: unknown): ApiErrorBody | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const error = record.error;
  if (!error || typeof error !== "object") return null;
  const body = error as Record<string, unknown>;
  if (typeof body.code !== "string" || typeof body.message !== "string") {
    return null;
  }
  return {
    code: body.code,
    message: body.message,
    details: body.details,
  };
}

/** Map Axios / unknown errors into a stable shape for UI + logging hooks. */
export function mapApiError(error: unknown): MappedApiError {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;
    const status = axiosError.response?.status ?? null;
    const body = readErrorBody(axiosError.response?.data);

    return {
      status,
      code: body?.code ?? (status ? `http_${status}` : "network_error"),
      message:
        body?.message ??
        axiosError.message ??
        "Something went wrong. Please try again.",
      details: body?.details,
      isUnauthorized: status === 401,
      isForbidden: status === 403,
      cause: error,
    };
  }

  if (error instanceof Error) {
    return {
      status: null,
      code: "unknown_error",
      message: error.message,
      isUnauthorized: false,
      isForbidden: false,
      cause: error,
    };
  }

  return {
    status: null,
    code: "unknown_error",
    message: "Something went wrong. Please try again.",
    isUnauthorized: false,
    isForbidden: false,
    cause: error,
  };
}

export class ApiClientError extends Error {
  readonly mapped: MappedApiError;

  constructor(mapped: MappedApiError) {
    super(mapped.message);
    this.name = "ApiClientError";
    this.mapped = mapped;
  }
}

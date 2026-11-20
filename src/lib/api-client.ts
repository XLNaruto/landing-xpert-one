/**
 * The XpertOne API client — the landing counterpart of `src/lib/api-client.ts`
 * and `src/lib/http.ts` in app-xpert-one.
 *
 * Used both at build time (Server Components) and in the browser. Auth works
 * like the app's request interceptor (`Authorization: Bearer …`), except the
 * token comes from `XPERTONE_API_TOKEN` rather than a signed-in user — and is
 * only attached at build/server time; see `serverApiToken` in lib/env.ts.
 */
import axios, { AxiosError, type AxiosRequestConfig } from "axios"
import { env, serverApiToken } from "@/lib/env"

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  const token = serverApiToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/** `.data` straight off the response, as the app's `http` helper does. */
export const http = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<TResponse>(url, config).then((r) => r.data),

  post: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) => apiClient.post<TResponse>(url, body, config).then((r) => r.data),
}

/**
 * The API's error body — e.g.
 * `{ "code": "NOT_FOUND", "message": "The Privacy Policy has not been published yet." }`.
 */
type ApiErrorBody = { code?: string; message?: string }

/** A failed call, with the server's own message, status and code. */
export class ApiError extends Error {
  readonly status?: number
  readonly code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

/** Any thrown value → an ApiError, preferring what the server said. */
export function toApiError(error: unknown, fallback: string): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined
    return new ApiError(
      body?.message || error.message || fallback,
      error.response?.status,
      body?.code ?? error.code,
    )
  }
  return new ApiError(error instanceof Error ? error.message : fallback)
}

/** True when a request was cancelled (component unmounted, effect re-run). */
export function isCancelled(error: unknown): boolean {
  /* The api layers wrap everything in ApiError, which keeps axios's code. */
  if (error instanceof ApiError) return error.code === AxiosError.ERR_CANCELED
  return axios.isCancel(error)
}

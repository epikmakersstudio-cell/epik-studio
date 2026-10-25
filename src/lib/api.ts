// Base address of the Epikmakers backend (sign-in, sign-up, portfolio photos, reviews, bookings).
// Set VITE_API_URL in .env locally and in the Vercel project settings.
// VITE_AUTH_API_URL is still accepted so an earlier setup keeps working.
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_AUTH_API_URL) as
  | string
  | undefined;

export const API_ENABLED = Boolean(API_BASE_URL);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

// One place that talks to the API: adds the sign-in token, sends JSON (or a FormData upload as-is)
// and turns error responses into an ApiError carrying the API's own message for the visitor.
export async function apiRequest<T>(path: string, { method = "GET", body, token }: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) throw new ApiError(0, "This feature isn't available yet. Please check back soon.");

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "We couldn't reach the server. Please check your connection and try again.");
  }

  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof data?.message === "string" ? data.message : "Something went wrong. Please try again.",
      data?.errors ?? {},
    );
  }
  return data as T;
}

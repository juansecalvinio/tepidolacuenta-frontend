type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  interceptRequest?: (
    input: RequestInfo,
    init: RequestInit
  ) => Promise<[RequestInfo, RequestInit]> | [RequestInfo, RequestInit];
  interceptResponse?: (response: Response) => Promise<Response> | Response;
}

export class HttpClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private interceptRequest?: HttpClientOptions["interceptRequest"];
  private interceptResponse?: HttpClientOptions["interceptResponse"];

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl || "";
    this.headers = options.headers || {};
    this.interceptRequest = options.interceptRequest;
    this.interceptResponse = options.interceptResponse;
  }

  private buildUrl(url: string): string {
    if (!this.baseUrl) return url;
    return `${this.baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
  }

  private async request<TResponse>(
    url: string,
    method: HttpMethod,
    body?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<TResponse> {
    let input: RequestInfo = this.buildUrl(url);
    let init: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...customHeaders,
      },
      body:
        body !== undefined && method !== "GET" && method !== "DELETE"
          ? JSON.stringify(body)
          : undefined,
    };

    if (this.interceptRequest) {
      [input, init] = await this.interceptRequest(input, init);
    }

    let response = await fetch(input, init);

    if (this.interceptResponse) {
      response = await this.interceptResponse(response);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error ${response.status}`);
    }

    if (response.status === 204) return null as unknown as TResponse;

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    } else {
      // Para respuestas de texto, blobs, etc
      const data = await response.text();
      return data as unknown as TResponse;
    }
  }

  get<TResponse>(url: string, headers?: Record<string, string>) {
    return this.request<TResponse>(url, "GET", undefined, headers);
  }

  post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    headers?: Record<string, string>
  ) {
    return this.request<TResponse>(url, "POST", body, headers);
  }

  put<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    headers?: Record<string, string>
  ) {
    return this.request<TResponse>(url, "PUT", body, headers);
  }

  patch<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    headers?: Record<string, string>
  ) {
    return this.request<TResponse>(url, "PATCH", body, headers);
  }

  delete<TResponse>(url: string, headers?: Record<string, string>) {
    return this.request<TResponse>(url, "DELETE", undefined, headers);
  }
}

export const api = new HttpClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  interceptRequest: (input, init) => {
    const token = sessionStorage.getItem("auth-token");

    if (token && init.headers) {
      (init.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    return [input, init];
  },
});

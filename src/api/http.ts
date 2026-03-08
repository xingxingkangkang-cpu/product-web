/**
 * HTTP request helper.
 */

export class HttpResponseError extends Error {
  status?: number;
  url: string;
  contentType?: string;

  constructor(
    message: string,
    options: {
      url: string;
      status?: number;
      contentType?: string | null;
    },
  ) {
    super(message);
    this.name = 'HttpResponseError';
    this.url = options.url;
    this.status = options.status;
    this.contentType = options.contentType ?? undefined;
  }
}

function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }

  return contentType.includes('application/json') || contentType.includes('+json');
}

function looksLikeJson(text: string): boolean {
  const trimmed = text.trim();

  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  const contentType = response.headers.get('content-type');
  const bodyText = await response.text();

  if (!response.ok) {
    throw new HttpResponseError(`Request failed: ${response.status} ${response.statusText}`, {
      url,
      status: response.status,
      contentType,
    });
  }

  if (!isJsonContentType(contentType) && !looksLikeJson(bodyText)) {
    throw new HttpResponseError(
      `Expected JSON but received ${contentType ?? 'unknown content'} from ${url}`,
      {
        url,
        status: response.status,
        contentType,
      },
    );
  }

  try {
    return JSON.parse(bodyText) as T;
  } catch {
    throw new HttpResponseError(`Invalid JSON response from ${url}`, {
      url,
      status: response.status,
      contentType,
    });
  }
}

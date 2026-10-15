/**
 * Checks whether a request's Origin header matches the host serving the request.
 * Missing or malformed origins are rejected.
 */
export function isSameOrigin(requestOrigin: Request): boolean {
    const origin = requestOrigin.headers.get("origin");
    if (!origin) return false;
    try {
        return new URL(origin).host === new URL(requestOrigin.url).host;
    } catch {
        return false;
    }
}
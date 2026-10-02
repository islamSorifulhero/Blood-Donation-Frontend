/**
 * The Express backend sets its refresh token as an httpOnly cookie scoped to ITS OWN
 * domain. Since this frontend is deployed on a separate domain, browser JS can never
 * read or send that cookie back. Instead, our Next.js Route Handlers call the backend
 * server-to-server (see app/api/auth/*), read the raw Set-Cookie header out of that
 * response, and re-issue the token as our OWN first-party httpOnly cookie here. This
 * helper pulls a named cookie's value out of that raw header string.
 */
export function extractCookieValue(setCookieHeader: string | null, cookieName: string): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

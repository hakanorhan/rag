export function getLoginUrl(returnTo: string) {
  return `/api/login?${new URLSearchParams({ returnTo })}`;
}

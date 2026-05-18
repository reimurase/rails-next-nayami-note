export function safeNext(raw: string | null, fallback = "/concerns"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback; // 絶対URL を弾く
  if (raw.startsWith("//")) return fallback; // "//evil.com" を弾く
  return raw;
}

/**
 * ⚠️ FROZEN
 * - 現在：Rails API は別オリジン + Cookieセッションのため、SSR(Server Components)から
 *   ログイン必須API(/api/v1/concerns)を叩くと Cookie が付かず 401 になりやすい。
 * - 方針: concerns の取得は clientApi + SWR に寄せる。
 * - 復活条件: A方針（BFF化 / 同一オリジン化）に移行し、SSRでもセッションCookieを扱えるようになったら再開。
 */
// import { serverGet } from "./serverApi";

// import type { Concern } from "@/components/concerns/ConcernIndex";

export function getConcerns() {
  throw new Error(
    "concernServer.getConcerns は凍結しています。クライアントAPI + SWRを使ってください。"
  );
  // return serverGet<Concern[]>("/api/v1/concerns");
}

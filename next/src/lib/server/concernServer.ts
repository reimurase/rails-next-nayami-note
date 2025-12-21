import { serverGet } from "./serverApi";

import type { Concern } from "@/components/concerns/ConcernIndex";

export function getConcerns() {
  return serverGet<Concern[]>("/api/v1/concerns");
}

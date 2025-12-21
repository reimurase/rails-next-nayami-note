import ConcernPageClient from "./ConcernPageClient";

import type { Concern } from "@/components/concerns/ConcernIndex";
import { serverGet } from "@/lib/server/serverApi";

export default async function Page() {
  const concerns = await serverGet<Concern[]>("/api/v1/concerns");
  return <ConcernPageClient initialConcerns={concerns} />;
}

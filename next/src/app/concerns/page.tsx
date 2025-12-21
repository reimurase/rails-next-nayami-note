import ConcernPageClient from "./ConcernPageClient";

import type { Concern } from "@/components/concerns/ConcernIndex";

async function fetchConcerns(): Promise<Concern[]> {
  const res = await fetch("http://localhost:3000/api/v1/concerns", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch concerns");
  return res.json();
}

export default async function Page() {
  const concerns = await fetchConcerns();
  return <ConcernPageClient initialConcerns={concerns} />;
}

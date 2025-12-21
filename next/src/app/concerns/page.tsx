import ConcernPageClient from "./ConcernPageClient";

import { getConcerns } from "@/lib/server/concernServer";

export default async function Page() {
  const concerns = await getConcerns();
  return <ConcernPageClient initialConcerns={concerns} />;
}

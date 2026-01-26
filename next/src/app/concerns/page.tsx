import ConcernPageClient from "./ConcernPageClient";

import { AuthGuard } from "@/components/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <ConcernPageClient />
    </AuthGuard>
  );
}

import ConcernPageClient from "./PageClient";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <ConcernPageClient />
    </AuthGuard>
  );
}

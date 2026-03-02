import IssuePageClient from "./IssuePageClient";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <IssuePageClient />
    </AuthGuard>
  );
}

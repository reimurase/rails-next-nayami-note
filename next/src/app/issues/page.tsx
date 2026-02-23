import IssuePageClient from "./IssuePageClient";

import { AuthGuard } from "@/components/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <IssuePageClient />
    </AuthGuard>
  );
}

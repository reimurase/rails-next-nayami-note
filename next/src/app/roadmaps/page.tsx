import RoadmapPageClient from "./PageClient";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <RoadmapPageClient />
    </AuthGuard>
  );
}

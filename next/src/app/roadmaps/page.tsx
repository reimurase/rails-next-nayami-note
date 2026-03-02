import RoadmapPageClient from "./RoadmapPageClient";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <RoadmapPageClient />
    </AuthGuard>
  );
}

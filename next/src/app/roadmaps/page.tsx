import RoadmapPageClient from "./RoadmapPageClient";

import { AuthGuard } from "@/components/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <RoadmapPageClient />
    </AuthGuard>
  );
}

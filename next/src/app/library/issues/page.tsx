import PageClient from "./PageClient";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function Page() {
  return (
    <AuthGuard>
      <PageClient />
    </AuthGuard>
  );
}

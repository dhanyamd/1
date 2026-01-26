import { WorkflowList } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";


const Page = async () => {
  await requireAuth();
  prefetchWorkflows()
  return  (
    <HydrateClient>
        <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<p>Loading..</p>}>
        <WorkflowList/>
        </Suspense>
        </ErrorBoundary>
    </HydrateClient>
  )
}

export default Page
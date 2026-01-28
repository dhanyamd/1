import { WorkflowList, WorkflowsContainer } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";


const Page = async () => {
  await requireAuth();
  prefetchWorkflows()
  return  (
    <WorkflowsContainer>
    <HydrateClient>
        <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<p>Loading..</p>}>
        <WorkflowList/>
        </Suspense>
        </ErrorBoundary>
    </HydrateClient>
    </WorkflowsContainer>
  )
}

export default Page
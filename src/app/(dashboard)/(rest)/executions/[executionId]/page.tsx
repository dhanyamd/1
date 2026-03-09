import { Skeleton } from "@/components/ui/skeleton";
import { ExecutionView } from "@/features/executions/components/execution";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>
};

const Page = async ({ params }: PageProps) => {
  const { executionId } = await params;
  prefetchExecution(executionId)
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary>
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <ExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  )
}
export default Page
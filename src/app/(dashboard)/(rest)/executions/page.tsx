import { requireAuth } from "@/lib/auth-utils";
import { SearchParams } from "nuqs";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";
import { CredentialList, CredentialContainer, CredentialError, Credentialloading } from "@/features/credentials/components/credentials";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions} from "@/features/executions/server/prefetch";
import { ExecutionContainer, ExecutionError, Executionloading, ExecutionsList } from "@/features/executions/components/executions";

type Props = {
    searchParams: Promise<SearchParams>
}
const Page = async ({searchParams}: Props) => {
    await requireAuth();

    const params = await executionsParamsLoader(searchParams)
    prefetchExecutions(params)
    return (
        <ExecutionContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<ExecutionError/>}>
            <Suspense fallback={<Executionloading/>}>
                <ExecutionsList />
            </Suspense>
            </ErrorBoundary>
        </HydrateClient>
       </ExecutionContainer>
    )
}

export default Page
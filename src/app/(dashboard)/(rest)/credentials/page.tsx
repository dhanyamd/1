import { requireAuth } from "@/lib/auth-utils";
import { SearchParams } from "nuqs";
import { credentialsParamsLoader } from "./server/params";
import { prefetchCredentials } from "./server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";
import { CredentialList, CredentialContainer, CredentialError, Credentialloading } from "@/features/credentials/components/credentials";

type Props = {
    searchParams: Promise<SearchParams>
}
const Page = async ({searchParams}: Props) => {
    await requireAuth();

    const params = await credentialsParamsLoader(searchParams)
    prefetchCredentials(params)
    return (
        <CredentialContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<CredentialError/>}>
            <Suspense fallback={<Credentialloading/>}>
                <CredentialList />
            </Suspense>
            </ErrorBoundary>
        </HydrateClient>
       </CredentialContainer>
    )
}

export default Page
import { CredentialView } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";
import { prefetchCredential } from "../server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";
import { CredentialError, Credentialloading } from "@/features/credentials/components/credentials";

interface PageProps {
    params : Promise <{
        credentialId: string
    }>
};

const Page = async ({params}: PageProps) => {
    await requireAuth();
    const {credentialId} = await params;
    prefetchCredential(credentialId)
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
            <HydrateClient>
             <ErrorBoundary fallback={<CredentialError/>}>
                <Suspense fallback={<Credentialloading/>}/>
            <CredentialView  credentialId={credentialId}/>
            </ErrorBoundary>
            </HydrateClient>
            </div>
        </div>
    )
}

export default Page
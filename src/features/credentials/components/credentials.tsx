'use client'
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { Credential, CredentialType } from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCredentialParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/features/workflows/hooks/use-entity-search";
import { useUpgradeModal } from "@/features/workflows/hooks/use-upgrade-modal";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useCreateWorkflow } from "@/features/workflows/hooks/use-workflows";
import Image from "next/image";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params, setParams
    })
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search credentials"
        />
    )
}

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialParams();
    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page })}

        />
    )
}

export const CredentialList = () => {
    const credentials = useSuspenseCredentials();

    return (
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential} />}
            emptyView={<CredentialsEmpty />}
        />
    )
}

export const CredentialHeader = ({ disabled }: { disabled?: boolean }) => {

    return (

        <EntityHeader
            title="Credentials"
            description="Create and manage your credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New credential"
            disabled={disabled}
        />

    )
}

export const CredentialContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<CredentialHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    )
}


export const Credentialloading = () => {
    return <LoadingView entity="Loading credentials..." />
}

export const CredentialError = () => {
    return <ErrorView message="Error loading credentials..." />
}

export const CredentialsEmpty = () => {
    const router = useRouter()

    const handleCreate = () => {
        router.push('/credentials/new')
    }
    return (
        <EmptyView
            onNew={handleCreate}
            message="No credentials found. Get startedd by creating your first credential"
        />

    )
}
const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/openai.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
    [CredentialType.GEMINI]: "/gemini.svg",
}
export const CredentialItem = ({
    data,
}: {
    data: Credential
}) => {
    const removeCredential = useRemoveCredential();
    const logo = credentialLogos[data.type] || "/openai.svg"
    const handleRemove = () => {
        removeCredential.mutate({ id: data.id });
    };

    return (
        <EntityItem
            href={`/credential/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <Image src={logo} alt={data.type} width={20} height={20} />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}
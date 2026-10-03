"use client";
import EmptyState from "@/components/ui/empty-state";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { seesPermittedOnly } from "@/lib/utils/permissions";
import { ONBOARDING_ROUTE } from "@/lib/workspace/constants";

export default function AccountDirectoryEmpty() {
    const { workspace, can } = useWorkspace();

    if (seesPermittedOnly(workspace.role)) {
        return <EmptyState {...EMPTY_STATES.accountsNotShared} />;
    }
    if (!can("completeVerification")) {
        return <EmptyState {...EMPTY_STATES.accountsAskOwner} />;
    }

    return (
        <EmptyState
            {...EMPTY_STATES.accountsAwaiting}
            action={
                workspace.verificationState === "approved"
                    ? undefined
                    : { label: COPY.continue, href: ONBOARDING_ROUTE }
            }
        />
    );
}

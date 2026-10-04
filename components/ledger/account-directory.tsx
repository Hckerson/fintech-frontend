import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import AccountDirectoryView from "@/components/ledger/account-directory-view";
import { reads } from "@/lib/hooks/reads";
import type { AccountsParams } from "@/lib/types";
import { currentWorkspace } from "@/lib/utils/current-workspace";

export default async function AccountDirectory(params: AccountsParams) {
    const workspace = await currentWorkspace();
    const client = new QueryClient();

    if (workspace) {
        await client.prefetchQuery(reads.accounts(workspace.id));
    }

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <AccountDirectoryView {...params} />
        </HydrationBoundary>
    );
}

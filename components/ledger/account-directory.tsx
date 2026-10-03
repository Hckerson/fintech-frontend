import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import AccountDirectoryView from "@/components/ledger/account-directory-view";
import { getAccounts } from "@/lib/actions/get-accounts";
import { queryKeys } from "@/lib/hooks/query-keys";
import type { AccountsParams } from "@/lib/types";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { unwrapResult } from "@/lib/utils/query-error";

export default async function AccountDirectory(params: AccountsParams) {
    const workspace = await currentWorkspace();
    const client = new QueryClient();

    if (workspace) {
        await client.prefetchQuery({
            queryKey: queryKeys.accounts.all(workspace.id),
            queryFn: async () => unwrapResult(await getAccounts()),
        });
    }

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <AccountDirectoryView {...params} />
        </HydrationBoundary>
    );
}

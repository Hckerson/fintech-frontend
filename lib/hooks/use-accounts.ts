import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/lib/actions/get-accounts";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { unwrapResult } from "@/lib/utils/query-error";

export const useAccounts = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.accounts.all(workspace.id),
        queryFn: async () => unwrapResult(await getAccounts()),
        enabled,
        ...readOptions("live"),
    });
};

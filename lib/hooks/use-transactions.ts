import { useQuery } from "@tanstack/react-query";
import { listTransactions } from "@/lib/actions/list-transactions";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { TransactionQuery } from "@/lib/types";
import { unwrapResult } from "@/lib/utils/query-error";

export const useTransactions = (query: TransactionQuery) => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.transactions.list(workspace.id, query),
        queryFn: async () => unwrapResult(await listTransactions(query)),
        ...readOptions("live"),
    });
};

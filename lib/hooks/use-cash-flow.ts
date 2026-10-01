import { useQuery } from "@tanstack/react-query";
import { getCashFlow } from "@/lib/actions/get-cash-flow";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { CashFlowQuery } from "@/lib/types";
import { unwrapResult } from "@/lib/utils/query-error";

export const useCashFlow = (query: CashFlowQuery) => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.cashFlow(workspace.id, query),
        queryFn: async () => unwrapResult(await getCashFlow(query)),
        ...readOptions("standard"),
    });
};

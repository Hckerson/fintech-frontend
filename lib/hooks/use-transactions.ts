import { useQuery } from "@tanstack/react-query";
import { readOptions } from "@/lib/hooks/read-options";
import { reads } from "@/lib/hooks/reads";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { TransactionQuery } from "@/lib/types";

export const useTransactions = (query: TransactionQuery) => {
    const { workspace } = useWorkspace();

    return useQuery({
        ...reads.transactions(workspace.id, query),
        ...readOptions("live"),
    });
};

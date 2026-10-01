import { useQuery } from "@tanstack/react-query";
import { getCashPosition } from "@/lib/actions/get-cash-position";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { unwrapResult } from "@/lib/utils/query-error";

export const useCashPosition = ({
    enabled = true,
}: { enabled?: boolean } = {}) => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.accounts.cashPosition(workspace.id),
        queryFn: async () => unwrapResult(await getCashPosition()),
        enabled,
        ...readOptions("live"),
    });
};

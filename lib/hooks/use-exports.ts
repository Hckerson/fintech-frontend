import { useQuery } from "@tanstack/react-query";
import { listExports } from "@/lib/actions/list-exports";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { unwrapResult } from "@/lib/utils/query-error";

export const useExports = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.exports.all(workspace.id),
        queryFn: async () => unwrapResult(await listExports()),
        enabled,
        ...readOptions("live"),
    });
};

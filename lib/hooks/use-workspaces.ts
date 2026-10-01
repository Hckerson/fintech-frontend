import { useQuery } from "@tanstack/react-query";
import { listWorkspaces } from "@/lib/actions/list-workspaces";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { unwrapResult } from "@/lib/utils/query-error";

export const useWorkspaces = () =>
    useQuery({
        queryKey: queryKeys.workspaces(),
        queryFn: async () => unwrapResult(await listWorkspaces()),
        ...readOptions("slow"),
        refetchOnWindowFocus: true,
    });

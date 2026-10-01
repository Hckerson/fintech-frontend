import { useMutation } from "@tanstack/react-query";
import { switchWorkspace } from "@/lib/actions/switch-workspace";
import { unwrapResult } from "@/lib/utils/query-error";

export const useSwitchWorkspace = () =>
    useMutation({
        mutationFn: async (workspaceId: string) =>
            unwrapResult(await switchWorkspace(workspaceId)),
    });

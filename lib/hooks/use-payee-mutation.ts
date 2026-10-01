import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REQUEST_FAILED } from "@/lib/constants";
import { queryKeys } from "@/lib/hooks/query-keys";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { settle } from "@/lib/utils/unwrap";
import { MUTATION_TIMEOUT_MS } from "@/lib/query/constants";
import type { ActionResult } from "@/lib/types";
import { ActionError } from "@/lib/utils/action-error";

export const usePayeeMutation = <TInput, TData>(
    action: (input: TInput) => Promise<ActionResult<TData>>,
) => {
    const queryClient = useQueryClient();
    const { workspace } = useWorkspace();

    return useMutation<TData, ActionError, TInput>({
        networkMode: "always",
        retry: false,
        mutationFn: (input) =>
            navigator.onLine
                ? settle(action(input), MUTATION_TIMEOUT_MS, "unconfirmed")
                : Promise.reject(new ActionError("offline", REQUEST_FAILED)),
        onSettled: () => {
            void queryClient.invalidateQueries({
                queryKey: queryKeys.payees.all(workspace.id),
            });
        },
    });
};

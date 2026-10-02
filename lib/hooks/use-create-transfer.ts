import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "@/lib/actions/create-transfer";
import { REQUEST_FAILED } from "@/lib/constants";
import { queryKeys } from "@/lib/hooks/query-keys";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { MUTATION_TIMEOUT_MS } from "@/lib/query/constants";
import type { Transfer, TransferInput } from "@/lib/types";
import { ActionError } from "@/lib/utils/action-error";
import { settle } from "@/lib/utils/unwrap";

export const useCreateTransfer = () => {
    const queryClient = useQueryClient();
    const { workspace } = useWorkspace();

    return useMutation<Transfer, ActionError, TransferInput>({
        networkMode: "always",
        retry: false,
        mutationFn: (input) =>
            navigator.onLine
                ? settle(
                      createTransfer(input),
                      MUTATION_TIMEOUT_MS,
                      "unconfirmed",
                  )
                : Promise.reject(new ActionError("offline", REQUEST_FAILED)),
        onSettled: () => {
            for (const queryKey of [
                queryKeys.transfers.options(workspace.id),
                queryKeys.accounts.all(workspace.id),
                queryKeys.payees.all(workspace.id),
                queryKeys.transactions.all(workspace.id),
            ]) {
                void queryClient.invalidateQueries({ queryKey });
            }
        },
    });
};

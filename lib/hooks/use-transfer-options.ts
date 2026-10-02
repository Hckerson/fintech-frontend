import { useQuery } from "@tanstack/react-query";
import { getTransferOptions } from "@/lib/actions/get-transfer-options";
import { REQUEST_TIMEOUT_MS } from "@/lib/constants";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { TransferOptions } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";
import { settle } from "@/lib/utils/unwrap";

export const useTransferOptions = (enabled: boolean) => {
    const { workspace } = useWorkspace();

    return useQuery<TransferOptions, ActionError>({
        queryKey: queryKeys.transfers.options(workspace.id),
        queryFn: () =>
            settle(getTransferOptions(), REQUEST_TIMEOUT_MS, "unavailable"),
        enabled,
        ...readOptions("live"),
    });
};

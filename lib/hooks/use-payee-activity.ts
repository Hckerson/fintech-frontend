import { useQuery } from "@tanstack/react-query";
import { getPayeeActivity } from "@/lib/actions/get-payee-activity";
import { REQUEST_TIMEOUT_MS } from "@/lib/constants";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { PayeeActivity } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";
import { settle } from "@/lib/utils/unwrap";

export const usePayeeActivity = (payeeId: string) => {
    const { workspace } = useWorkspace();

    return useQuery<PayeeActivity, ActionError>({
        queryKey: [...queryKeys.payees.all(workspace.id), "activity", payeeId],
        queryFn: () =>
            settle(
                getPayeeActivity(payeeId),
                REQUEST_TIMEOUT_MS,
                "unavailable",
            ),
        ...readOptions("standard"),
    });
};

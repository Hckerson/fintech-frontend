import {
    keepPreviousData,
    useInfiniteQuery,
    type InfiniteData,
} from "@tanstack/react-query";
import { listPayees } from "@/lib/actions/list-payees";
import { REQUEST_TIMEOUT_MS, STALE_TIME } from "@/lib/constants";
import { queryKeys } from "@/lib/hooks/query-keys";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { settle } from "@/lib/utils/unwrap";
import {
    QUERY_RETRY_BASE_MS,
    QUERY_RETRY_LIMIT,
    QUERY_RETRY_MAX_MS,
} from "@/lib/query/constants";
import type { PayeePage } from "@/lib/types";
import type { ActionError } from "@/lib/utils/action-error";

export const usePayees = (search: string, enabled: boolean) => {
    const { workspace } = useWorkspace();

    return useInfiniteQuery<
        PayeePage,
        ActionError,
        InfiniteData<PayeePage>,
        readonly unknown[],
        string | null
    >({
        queryKey: queryKeys.payees.list(workspace.id, search),
        enabled,
        queryFn: ({ pageParam }) =>
            settle(
                listPayees({ search, cursor: pageParam }),
                REQUEST_TIMEOUT_MS,
                "unavailable",
            ),
        initialPageParam: null,
        getNextPageParam: (page) => page.nextCursor,
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME.standard,
        retry: (failures, error) =>
            error.kind === "unavailable" && failures < QUERY_RETRY_LIMIT,
        retryDelay: (attempt) =>
            Math.min(QUERY_RETRY_BASE_MS * 2 ** attempt, QUERY_RETRY_MAX_MS) *
            (0.5 + Math.random() / 2),
    });
};

import { STALE_TIME } from "@/lib/constants";
import {
    QUERY_RETRY_BASE_MS,
    QUERY_RETRY_LIMIT,
    QUERY_RETRY_MAX_MS,
} from "@/lib/query/constants";
import { isRetryable } from "@/lib/utils/query-error";

export const readOptions = (tier: keyof typeof STALE_TIME) => ({
    staleTime: STALE_TIME[tier],
    refetchOnWindowFocus: tier === "live",
    retry: (failures: number, error: Error) =>
        failures < QUERY_RETRY_LIMIT && isRetryable(error),
    retryDelay: (attempt: number) =>
        Math.min(QUERY_RETRY_BASE_MS * 2 ** attempt, QUERY_RETRY_MAX_MS),
});

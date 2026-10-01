import type { ActionResult, ErrorKind } from "@/lib/types";
import { ActionError } from "@/lib/utils/action-error";

const RETRYABLE: readonly ErrorKind[] = [
    "unavailable",
    "rate_limited",
    "offline",
];

export const unwrapResult = <TData>(result: ActionResult<TData>): TData => {
    if (!result.ok) throw ActionError.from(result);
    return result.data;
};

export const kindOf = (error: unknown): ErrorKind =>
    error instanceof ActionError ? error.kind : "unavailable";

export const referenceOf = (error: unknown): string | undefined =>
    error instanceof ActionError ? error.reference : undefined;

export const isRetryable = (error: unknown) =>
    RETRYABLE.includes(kindOf(error));

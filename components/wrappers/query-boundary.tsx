"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { nanoid } from "nanoid";
import type { UseQueryResult } from "@tanstack/react-query";
import ErrorState from "@/components/ui/error-state";
import { LOGIN_ROUTE } from "@/lib/constants";
import { ERROR_COPY, ERROR_MESSAGE } from "@/lib/data/error-messages";
import { SHELL_COPY } from "@/lib/data/shell";
import { useOnline } from "@/lib/hooks/use-online";
import { isRetryable, kindOf, referenceOf } from "@/lib/utils/query-error";
import { queryString } from "@/lib/utils/query-string";

interface Props<TData> {
    query: UseQueryResult<TData>;
    isEmpty: (data: TData) => boolean;
    skeleton: ReactNode;
    empty: ReactNode;
    denied?: ReactNode;
    children: (data: TData) => ReactNode;
}

export default function QueryBoundary<TData>({
    query,
    isEmpty,
    skeleton,
    empty,
    denied,
    children,
}: Props<TData>) {
    const online = useOnline();
    const pathname = usePathname();
    const [deviceReference] = useState(() => nanoid());
    const kind = query.isError ? kindOf(query.error) : null;
    const reference = referenceOf(query.error) ?? deviceReference;
    const retry = () => void query.refetch();

    if (query.data !== undefined) {
        return (
            <div aria-busy={query.isFetching} className="flex flex-col gap-3">
                {query.isError || !online ? (
                    <p role="status" className="text-warning text-xs">
                        {online ? SHELL_COPY.stale : SHELL_COPY.offlineStale}
                    </p>
                ) : null}
                {isEmpty(query.data) ? empty : children(query.data)}
            </div>
        );
    }

    if (kind === "forbidden") return <>{denied ?? empty}</>;

    if (kind === "unauthenticated") {
        return (
            <ErrorState
                kind="non-retryable"
                message={ERROR_MESSAGE.unauthenticated}
                reference={reference}
            >
                <Link
                    href={`${LOGIN_ROUTE}${queryString({ next: pathname })}`}
                    className="text-accent text-sm underline-offset-4 hover:underline"
                >
                    {ERROR_COPY.signIn}
                </Link>
            </ErrorState>
        );
    }

    if (!online) {
        return (
            <ErrorState
                kind="offline"
                message={ERROR_COPY.offline}
                reference={reference}
            />
        );
    }

    if (query.isError) {
        const retryable = isRetryable(query.error);
        return (
            <div role="alert">
                <ErrorState
                    kind={retryable ? "retryable" : "non-retryable"}
                    message={
                        retryable
                            ? ERROR_COPY.loadFailed
                            : ERROR_COPY.cannotLoad
                    }
                    reference={reference}
                    onRetry={retry}
                    retrying={query.isFetching}
                />
            </div>
        );
    }

    return <div aria-busy>{skeleton}</div>;
}

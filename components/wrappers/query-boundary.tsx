"use client";
import clsx from "clsx";
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
    flush?: boolean;
    grow?: boolean;
    children: (data: TData) => ReactNode;
}

export default function QueryBoundary<TData>({
    query,
    isEmpty,
    skeleton,
    empty,
    denied,
    flush = false,
    grow = false,
    children,
}: Props<TData>) {
    const inset = flush ? "p-4" : undefined;
    const online = useOnline();
    const pathname = usePathname();
    const [deviceReference] = useState(() => nanoid());
    const kind = query.isError ? kindOf(query.error) : null;
    const reference = referenceOf(query.error) ?? deviceReference;
    const retry = () => void query.refetch();

    const failure = () => {
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
    };

    if (query.data !== undefined) {
        return (
            <div
                aria-busy={query.isFetching}
                className={clsx(
                    "flex flex-col",
                    !flush && "gap-3",
                    grow && "min-h-0 flex-1",
                )}
            >
                {query.isError || !online ? (
                    <p
                        role="status"
                        className={clsx(
                            "text-warning text-xs",
                            flush && "px-4 pt-3",
                        )}
                    >
                        {online ? SHELL_COPY.stale : SHELL_COPY.offlineStale}
                    </p>
                ) : null}
                {isEmpty(query.data) ? (
                    <div className={inset}>{empty}</div>
                ) : (
                    children(query.data)
                )}
            </div>
        );
    }

    if (kind === "forbidden") {
        return <div className={inset}>{denied ?? empty}</div>;
    }

    if (query.isError || !online) {
        return <div className={inset}>{failure()}</div>;
    }

    return (
        <div aria-busy className={inset}>
            {skeleton}
        </div>
    );
}

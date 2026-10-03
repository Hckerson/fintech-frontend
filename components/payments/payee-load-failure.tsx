"use client";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useState } from "react";
import ErrorState from "@/components/ui/error-state";
import { LOGIN_ROUTE, PAYMENTS_ROUTE } from "@/lib/constants";
import {
    ERROR_COPY,
    ERROR_MESSAGE,
    READ_ERROR_KIND,
} from "@/lib/data/error-messages";
import type { ActionError } from "@/lib/utils/action-error";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    failure: ActionError | null;
    retrying: boolean;
    onRetry: () => void;
}

export default function PayeeLoadFailure({
    failure,
    retrying,
    onRetry,
}: Props) {
    const [deviceReference] = useState(() => nanoid());
    const kind = failure
        ? (READ_ERROR_KIND[failure.kind] ?? "non-retryable")
        : "offline";
    const signedOut = failure?.kind === "unauthenticated";

    return (
        <div className="px-4 py-4">
            <ErrorState
                kind={kind}
                message={
                    kind === "retryable"
                        ? ERROR_COPY.loadFailed
                        : kind === "offline"
                          ? ERROR_COPY.offline
                          : signedOut
                            ? ERROR_MESSAGE.unauthenticated
                            : ERROR_COPY.cannotLoad
                }
                reference={failure?.reference ?? deviceReference}
                onRetry={failure ? onRetry : undefined}
                retrying={retrying}
            >
                {signedOut ? (
                    <Link
                        href={`${LOGIN_ROUTE}${queryString({ next: PAYMENTS_ROUTE })}`}
                        className="text-accent text-sm underline underline-offset-4"
                    >
                        {ERROR_COPY.signIn}
                    </Link>
                ) : null}
            </ErrorState>
        </div>
    );
}

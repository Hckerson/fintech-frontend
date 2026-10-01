"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ErrorReference from "@/components/ui/error-reference";
import { LOGIN_ROUTE } from "@/lib/constants";
import { ERROR_COPY, ERROR_MESSAGE } from "@/lib/data/error-messages";
import type { ActionError } from "@/lib/utils/action-error";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    notice: string | null;
    error: ActionError | null;
    message?: string;
}

export default function WriteStatus({ notice, error, message }: Props) {
    const next = usePathname();
    const alert = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (error) alert.current?.focus();
    }, [error]);

    return (
        <>
            <p
                role="status"
                className={
                    notice
                        ? "bg-background-muted text-text-secondary rounded-lg px-3 py-2 text-sm"
                        : "sr-only"
                }
            >
                {notice ?? ""}
            </p>
            {error ? (
                <div
                    ref={alert}
                    tabIndex={-1}
                    role="alert"
                    className="border-error/30 bg-error-light text-error flex flex-col gap-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
                >
                    <p>{message ?? ERROR_MESSAGE[error.kind]}</p>
                    {error.kind === "unauthenticated" ? (
                        <Link
                            href={`${LOGIN_ROUTE}${queryString({ next })}`}
                            className="underline underline-offset-4"
                        >
                            {ERROR_COPY.signIn}
                        </Link>
                    ) : null}
                    <ErrorReference reference={error.reference} />
                </div>
            ) : null}
        </>
    );
}

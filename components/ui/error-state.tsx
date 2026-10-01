"use client";
import type { ReactNode } from "react";
import { WarningAlt } from "@carbon/icons-react";
import Button from "@/components/ui/button";
import { ERROR_COPY } from "@/lib/data/error-messages";

interface Props {
    kind: "retryable" | "non-retryable" | "offline";
    message: string;
    reference: string;
    onRetry?: () => void;
    retrying?: boolean;
    children?: ReactNode;
}

export default function ErrorState({
    kind,
    message,
    reference,
    onRetry,
    retrying = false,
    children,
}: Props) {
    return (
        <div className="flex flex-col items-start gap-3 py-2">
            <p className="text-text flex gap-2 text-sm">
                <WarningAlt
                    aria-hidden
                    className="text-warning mt-0.5 size-4 shrink-0"
                />
                {message}
            </p>
            {onRetry && kind !== "non-retryable" ? (
                <Button
                    size="sm"
                    tone="quiet"
                    onClick={onRetry}
                    isLoading={retrying}
                >
                    {retrying ? ERROR_COPY.retrying : ERROR_COPY.retry}
                </Button>
            ) : null}
            {children}
            <p className="text-text-muted font-mono text-xs">
                {ERROR_COPY.reference}{" "}
                <span className="text-text-secondary select-all">
                    {reference}
                </span>
            </p>
        </div>
    );
}

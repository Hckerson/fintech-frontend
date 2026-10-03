"use client";
import clsx from "clsx";
import Link from "next/link";
import { useId } from "react";
import {
    Information,
    Misuse,
    WarningAlt,
    type CarbonIconType,
} from "@carbon/icons-react";
import { buttonClass } from "@/components/ui/button";
import { VERIFICATION_STATE_LABELS } from "@/lib/data/status-labels";
import { VERIFICATION_COPY as COPY } from "@/lib/data/verification";
import { useVerificationCase } from "@/lib/hooks/use-verification-case";
import type { Severity, VerificationState } from "@/lib/types";
import { onboardingStepRoute } from "@/lib/workspace/constants";

interface Props {
    informational?: boolean;
}

const INFORMATIONAL: readonly VerificationState[] = ["needs_info", "rejected"];
const ACTIONABLE: readonly VerificationState[] = [
    "not_started",
    "in_progress",
    "needs_info",
];

const TONES: Partial<Record<Severity, { frame: string; mark: string }>> = {
    attention: {
        frame: "border-warning/30 bg-warning-light",
        mark: "text-warning",
    },
    problem: { frame: "border-error/30 bg-error-light", mark: "text-error" },
};
const QUIET = {
    frame: "border-border bg-background-alt",
    mark: "text-text-muted",
};

const ICONS: Partial<Record<Severity, CarbonIconType>> = {
    attention: WarningAlt,
    problem: Misuse,
};

export default function VerificationNotice({ informational = false }: Props) {
    const titleId = useId();
    const query = useVerificationCase();
    const verification = query.data;

    if (!verification || verification.state === "approved") return null;
    if (informational && !INFORMATIONAL.includes(verification.state)) {
        return null;
    }

    const { state, requests, reference } = verification;
    const { severity } = VERIFICATION_STATE_LABELS[state];
    const tone = TONES[severity] ?? QUIET;
    const Icon = ICONS[severity] ?? Information;

    return (
        <section
            aria-labelledby={titleId}
            className={clsx("flex flex-col rounded-lg border", tone.frame)}
        >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
                <Icon
                    aria-hidden
                    className={clsx("size-4 shrink-0", tone.mark)}
                />
                <p className="min-w-56 flex-1 text-sm">
                    <span
                        id={titleId}
                        role="heading"
                        aria-level={2}
                        className="text-text font-medium"
                    >
                        {COPY.title}
                    </span>
                    <span className="text-text-secondary">
                        {" · "}
                        {COPY.states[state]}
                        {informational ? ` ${COPY.informational}` : ""}
                    </span>
                </p>
                {state === "rejected" ? (
                    <>
                        <span className="text-text-secondary font-mono text-xs select-all">
                            {COPY.reference(reference)}
                        </span>
                        <Link
                            href={COPY.supportHref}
                            className={buttonClass("quiet", "sm")}
                        >
                            {COPY.support}
                        </Link>
                    </>
                ) : null}
                {!informational && ACTIONABLE.includes(state) ? (
                    <Link
                        href={onboardingStepRoute(
                            requests[0]?.fieldRef ?? null,
                        )}
                        className={buttonClass("quiet", "sm")}
                    >
                        {state === "needs_info" ? COPY.respond : COPY.continue}
                    </Link>
                ) : null}
            </div>
            {requests.length > 0 ? (
                <details className="border-warning/20 border-t px-4 py-2">
                    <summary className="text-text-secondary hover:text-text w-fit cursor-pointer text-xs">
                        {COPY.requests(requests.length)}
                    </summary>
                    <ol className="text-text flex list-decimal flex-col gap-1 pt-2 pl-5 text-sm">
                        {requests.map((request) => (
                            <li key={request.id}>{request.message}</li>
                        ))}
                    </ol>
                </details>
            ) : null}
            {query.isError ? (
                <p
                    role="status"
                    className="text-warning border-warning/20 border-t px-4 py-2 text-xs"
                >
                    {COPY.stale}
                </p>
            ) : null}
        </section>
    );
}

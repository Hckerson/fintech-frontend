"use client";
import Link from "next/link";
import SectionCard from "@/components/common/section-card";
import { buttonClass } from "@/components/ui/button";
import StatusLabel from "@/components/ui/status-label";
import { VERIFICATION_STATE_LABELS } from "@/lib/data/status-labels";
import { VERIFICATION_COPY as COPY } from "@/lib/data/verification";
import { useVerificationCase } from "@/lib/hooks/use-verification-case";
import type { VerificationState } from "@/lib/types";
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
const LINK = "text-accent text-sm underline-offset-4 hover:underline";
const ACTION = buttonClass("accent", "sm", "w-fit");

export default function VerificationNotice({ informational = false }: Props) {
    const query = useVerificationCase();
    const verification = query.data;

    if (!verification || verification.state === "approved") return null;
    if (informational && !INFORMATIONAL.includes(verification.state)) {
        return null;
    }

    const { state, requests, reference } = verification;

    return (
        <SectionCard
            title={COPY.title}
            attention={state !== "submitted"}
            aside={<StatusLabel {...VERIFICATION_STATE_LABELS[state]} />}
        >
            <p className="text-text-secondary measure text-sm">
                {COPY.states[state]}
            </p>
            {requests.length > 0 ? (
                <ol
                    aria-label={COPY.requests}
                    className="flex flex-col gap-2 text-sm"
                >
                    {requests.map((request, index) => (
                        <li key={request.id} className="flex gap-3">
                            <span
                                aria-hidden
                                className="border-warning/40 text-warning text-caption flex size-5 shrink-0 items-center justify-center rounded-full border"
                            >
                                {index + 1}
                            </span>
                            <span className="text-text">{request.message}</span>
                        </li>
                    ))}
                </ol>
            ) : null}
            {state === "rejected" ? (
                <p className="text-text-secondary text-sm">
                    <span className="font-mono select-all">
                        {COPY.reference(reference)}
                    </span>
                    {" · "}
                    <Link href={COPY.supportHref} className={LINK}>
                        {COPY.support}
                    </Link>
                </p>
            ) : null}
            {informational ? (
                <p className="text-text-muted text-xs">{COPY.informational}</p>
            ) : ACTIONABLE.includes(state) ? (
                <Link
                    href={onboardingStepRoute(requests[0]?.fieldRef ?? null)}
                    className={ACTION}
                >
                    {state === "needs_info" ? COPY.respond : COPY.continue}
                </Link>
            ) : null}
            {query.isError ? (
                <p role="status" className="text-warning text-xs">
                    {COPY.stale}
                </p>
            ) : null}
        </SectionCard>
    );
}

"use client";
import Link from "next/link";
import SectionCard from "@/components/common/section-card";
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
            aside={<StatusLabel {...VERIFICATION_STATE_LABELS[state]} />}
        >
            <p className="text-text-secondary measure text-sm">
                {COPY.states[state]}
            </p>
            {requests.length > 0 ? (
                <ul
                    aria-label={COPY.requests}
                    className="text-text flex list-disc flex-col gap-1 pl-5 text-sm"
                >
                    {requests.map((request) => (
                        <li key={request.id}>{request.message}</li>
                    ))}
                </ul>
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
                    className={LINK}
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

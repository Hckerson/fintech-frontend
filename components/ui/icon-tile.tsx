import clsx from "clsx";
import type { ReactNode } from "react";
import type { Severity } from "@/lib/types";

interface Props {
    icon: ReactNode;
    tone?: Severity;
}

const tones: Record<Severity, string> = {
    neutral: "bg-background-muted text-text-secondary",
    positive: "bg-success-light text-success",
    attention: "bg-warning-light text-warning",
    problem: "bg-error-light text-error",
    information: "bg-accent-light text-accent",
};

export default function IconTile({ icon, tone = "neutral" }: Props) {
    return (
        <span
            aria-hidden
            className={clsx(
                "flex size-8 shrink-0 items-center justify-center rounded-lg [&>svg]:size-4",
                tones[tone],
            )}
        >
            {icon}
        </span>
    );
}

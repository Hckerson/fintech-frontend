import clsx from "clsx";
import type { Severity } from "@/lib/types";

interface Props {
    label: string;
    severity: Severity;
}

const tones: Record<Severity, string> = {
    neutral: "bg-background-muted text-text-secondary",
    positive: "bg-success-light text-success",
    attention: "bg-warning-light text-warning",
    problem: "bg-error-light text-error",
    information: "bg-accent-light text-accent",
};

export default function StatusLabel({ label, severity }: Props) {
    return (
        <span
            className={clsx(
                "text-caption inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-medium whitespace-nowrap",
                tones[severity],
            )}
        >
            {label}
        </span>
    );
}

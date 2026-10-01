import clsx from "clsx";
import type { Severity } from "@/lib/types";

interface Props {
    label: string;
    severity: Severity;
}

const tones: Record<Severity, string> = {
    neutral: "border-border text-text-secondary",
    positive: "border-success/30 text-success",
    attention: "border-warning/30 text-warning",
    problem: "border-error/30 text-error",
    information: "border-border-dark text-text",
};

export default function StatusLabel({ label, severity }: Props) {
    return (
        <span
            className={clsx(
                "text-caption inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 whitespace-nowrap",
                tones[severity],
            )}
        >
            {label}
        </span>
    );
}

import type { ReactNode } from "react";

interface Props {
    currency: string;
    name: string;
    value: string;
    icon?: ReactNode;
}

export default function AuthAccountChip({
    currency,
    name,
    value,
    icon,
}: Props) {
    return (
        <div
            aria-hidden
            className="surface-card inline-flex items-center gap-4 px-5 py-4"
        >
            <span className="border-border-dark text-accent flex size-10 items-center justify-center rounded-full border font-mono text-xs">
                {currency}
            </span>
            <span className="flex flex-col gap-0.5">
                <span className="text-text-secondary text-sm">{name}</span>
                <span className="text-text font-mono tracking-[0.2em]">
                    {value}
                </span>
            </span>
            {icon ? <span className="text-text-muted ml-4">{icon}</span> : null}
        </div>
    );
}

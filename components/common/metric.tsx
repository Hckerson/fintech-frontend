import type { ReactNode } from "react";

interface Props {
    label: string;
    value: ReactNode;
    delta?: ReactNode;
    children?: ReactNode;
}

export default function Metric({ label, value, delta, children }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <dl className="flex flex-col gap-2">
                <dt className="text-text-muted font-mono text-xs tracking-[0.18em] uppercase">
                    {label}
                </dt>
                <dd className="ledger-figure text-text">{value}</dd>
            </dl>
            {delta}
            {children}
        </div>
    );
}

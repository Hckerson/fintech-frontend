import type { ReactNode } from "react";

interface Props {
    label: string;
    value: ReactNode;
    delta?: ReactNode;
    note?: ReactNode;
}

export default function Metric({ label, value, delta, note }: Props) {
    return (
        <dl className="flex min-w-0 flex-col gap-1">
            <dt className="text-text-muted text-xs">{label}</dt>
            <dd className="text-text text-h5 font-medium tabular-nums">
                {value}
            </dd>
            {delta || note ? (
                <dd className="text-text-muted flex flex-wrap items-center gap-x-2 text-xs">
                    {delta}
                    {note}
                </dd>
            ) : null}
        </dl>
    );
}

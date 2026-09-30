interface Props {
    value: number;
    max: number;
    label: string;
    valueText: string;
}

export default function Meter({ value, max, label, valueText }: Props) {
    const ratio = max > 0 ? Math.min(value / max, 1) : 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-text-secondary">{label}</span>
                <span className="text-text font-mono tabular-nums">
                    {valueText}
                </span>
            </div>
            <div
                role="meter"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={Math.min(value, max)}
                aria-valuetext={valueText}
                className="bg-background-muted h-2 overflow-hidden rounded-full"
            >
                <div
                    className={
                        ratio >= 1
                            ? "bg-success h-full rounded-full"
                            : "bg-accent h-full rounded-full"
                    }
                    style={{ width: `${ratio * 100}%` }}
                />
            </div>
        </div>
    );
}

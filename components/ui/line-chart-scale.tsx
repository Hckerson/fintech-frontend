interface Props {
    ticks: readonly { label: string; top: number }[];
}

export default function LineChartScale({ ticks }: Props) {
    return (
        <ol
            aria-hidden
            className="text-text-muted text-caption relative w-10 shrink-0 text-right tabular-nums sm:h-64"
        >
            {ticks.map(({ label, top }) => (
                <li
                    key={label}
                    className="absolute right-0 -translate-y-1/2"
                    style={{ top: `${top}%` }}
                >
                    {label}
                </li>
            ))}
        </ol>
    );
}

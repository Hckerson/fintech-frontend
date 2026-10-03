interface Props {
    count: string | number;
}

export default function CountBadge({ count }: Props) {
    return (
        <span
            aria-hidden
            className="bg-background-muted text-text-secondary text-caption rounded px-1.5 py-0.5 font-medium tabular-nums"
        >
            {count}
        </span>
    );
}

interface Props {
    label: string;
}

export default function AuthDivider({ label }: Props) {
    return (
        <div className="text-text-muted flex items-center gap-4 font-mono text-xs tracking-[0.18em] uppercase">
            <span aria-hidden className="bg-border-dark h-px flex-1" />
            {label}
            <span aria-hidden className="bg-border-dark h-px flex-1" />
        </div>
    );
}

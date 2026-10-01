interface Props {
    eyebrow: string;
    title: string;
    lead: string;
}

export default function AuthFormHeader({ eyebrow, title, lead }: Props) {
    return (
        <header className="flex flex-col gap-3">
            <p className="text-accent font-mono text-xs tracking-[0.18em] uppercase">
                {eyebrow}
            </p>
            <h1 className="ledger-title text-text">{title}</h1>
            <p className="text-text-secondary">{lead}</p>
        </header>
    );
}

interface Props {
    eyebrow: string;
    title: string;
    lead: string;
}

export default function AuthFormHeader({ eyebrow, title, lead }: Props) {
    return (
        <header className="flex flex-col gap-2.5">
            <p className="text-accent font-mono text-xs tracking-[0.18em] uppercase">
                {eyebrow}
            </p>
            <h1 className="text-h4 text-text font-medium tracking-tight text-balance">
                {title}
            </h1>
            <p className="text-text-secondary text-sm">{lead}</p>
        </header>
    );
}

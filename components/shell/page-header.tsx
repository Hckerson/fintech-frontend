import type { ReactNode } from "react";

interface Props {
    eyebrow?: string;
    title: string;
    lead?: string;
    actions?: ReactNode;
}

export default function PageHeader({ eyebrow, title, lead, actions }: Props) {
    return (
        <header className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
                {eyebrow ? (
                    <p className="micro-label text-text-muted">{eyebrow}</p>
                ) : null}
                <h1 className="ledger-title text-text">{title}</h1>
                {lead ? (
                    <p className="text-text-secondary max-w-xl">{lead}</p>
                ) : null}
            </div>
            {actions}
        </header>
    );
}

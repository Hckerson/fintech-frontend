import type { ReactNode } from "react";
import Breadcrumbs from "@/components/shell/breadcrumbs";
import type { Crumb } from "@/lib/types";

interface Props {
    eyebrow?: string;
    title: string;
    lead?: string;
    actions?: ReactNode;
    crumbs?: readonly Crumb[];
}

export default function PageHeader({
    eyebrow,
    title,
    lead,
    actions,
    crumbs,
}: Props) {
    return (
        <header className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
                {crumbs ? <Breadcrumbs crumbs={crumbs} /> : null}
                {eyebrow ? (
                    <p className="micro-label text-text-muted">{eyebrow}</p>
                ) : null}
                <h1
                    tabIndex={-1}
                    className="ledger-title text-text focus:outline-none"
                >
                    {title}
                </h1>
                {lead ? (
                    <p className="text-text-secondary max-w-xl">{lead}</p>
                ) : null}
            </div>
            {actions}
        </header>
    );
}

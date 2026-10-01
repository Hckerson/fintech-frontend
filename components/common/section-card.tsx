import Link from "next/link";
import { useId, type ReactNode } from "react";

interface Props {
    title: string;
    action?: { label: string; href: string };
    aside?: ReactNode;
    children: ReactNode;
}

export default function SectionCard({ title, action, aside, children }: Props) {
    const id = useId();

    return (
        <section
            aria-labelledby={id}
            className="surface-card flex min-w-0 flex-col gap-3 p-4"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id={id} className="text-text text-sm font-medium">
                    {title}
                </h2>
                {aside}
                {action ? (
                    <Link
                        href={action.href}
                        className="text-text-secondary hover:text-text text-xs underline-offset-4 hover:underline"
                    >
                        {action.label}
                    </Link>
                ) : null}
            </div>
            {children}
        </section>
    );
}

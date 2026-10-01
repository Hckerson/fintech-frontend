import Link from "next/link";
import { SHELL_COPY } from "@/lib/data/shell";
import type { Crumb } from "@/lib/types";

interface Props {
    crumbs: readonly Crumb[];
}

export default function Breadcrumbs({ crumbs }: Props) {
    return (
        <nav aria-label={SHELL_COPY.breadcrumb}>
            <ol className="text-text-muted flex flex-wrap items-center gap-2 text-xs">
                {crumbs.map(({ label, href }, index) => {
                    const last = index === crumbs.length - 1;
                    return (
                        <li key={label} className="flex items-center gap-2">
                            {href && !last ? (
                                <Link
                                    href={href}
                                    className="hover:text-text underline-offset-4 hover:underline"
                                >
                                    {label}
                                </Link>
                            ) : (
                                <span aria-current={last ? "page" : undefined}>
                                    {label}
                                </span>
                            )}
                            {last ? null : <span aria-hidden>›</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

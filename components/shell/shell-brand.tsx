import clsx from "clsx";
import Link from "next/link";
import LedgerGlyph from "@/components/ledgerline/ledger-glyph";

interface Props {
    name: string;
    href: string;
    quiet?: boolean;
}

export default function ShellBrand({ name, href, quiet = false }: Props) {
    return (
        <Link
            href={href}
            className={clsx(
                "focus-visible:outline-accent inline-flex items-center rounded-lg transition-colors focus-visible:outline-2",
                quiet
                    ? "text-text-muted hover:text-text gap-2 text-xs"
                    : "text-text gap-2.5 p-1.5 text-sm font-semibold tracking-tight",
            )}
        >
            <LedgerGlyph
                className={clsx(
                    quiet
                        ? "bg-background-muted text-text-secondary size-5 rounded p-1"
                        : "bg-accent text-text-inverse size-8 rounded-lg p-2",
                )}
            />
            {name}
        </Link>
    );
}

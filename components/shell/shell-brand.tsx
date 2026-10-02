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
                "focus-visible:outline-accent inline-flex items-center gap-2 rounded-md px-1 focus-visible:outline-2",
                quiet
                    ? "text-text-muted hover:text-text text-xs"
                    : "text-text text-sm font-semibold tracking-tight",
            )}
        >
            <LedgerGlyph
                className={clsx(
                    "rounded p-1",
                    quiet
                        ? "bg-background-muted text-text-secondary size-5"
                        : "bg-accent text-text-inverse size-6",
                )}
            />
            {name}
        </Link>
    );
}

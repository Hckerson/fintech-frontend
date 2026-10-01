import Link from "next/link";
import LedgerGlyph from "@/components/ledgerline/ledger-glyph";

interface Props {
    name: string;
    href: string;
}

export default function ShellBrand({ name, href }: Props) {
    return (
        <Link
            href={href}
            className="text-text focus-visible:outline-accent inline-flex items-center gap-2.5 rounded-md px-1 focus-visible:outline-2"
        >
            <LedgerGlyph className="bg-accent text-text-inverse size-6 rounded-md p-1" />
            <span className="font-semibold tracking-tight">{name}</span>
        </Link>
    );
}

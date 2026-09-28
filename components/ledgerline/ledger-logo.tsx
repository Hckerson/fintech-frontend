import Link from "next/link";
import LedgerGlyph from "@/components/ledgerline/ledger-glyph";
import { LEDGER_BRAND } from "@/lib/data/ledgerline/brand";

export default function LedgerLogo() {
    return (
        <Link href={LEDGER_BRAND.home} className="inline-flex items-center gap-2.5 text-text">
            <LedgerGlyph className="size-7 rounded-md bg-accent p-1.5 text-text-inverse" />
            <span className="text-lg font-semibold tracking-tight">{LEDGER_BRAND.name}</span>
        </Link>
    );
}

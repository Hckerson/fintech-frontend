import { LOGO_PATH } from "@/lib/ledgerline/constants";

interface Props {
    className?: string;
}

export default function LedgerGlyph({ className }: Props) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className={className}>
            <path d={LOGO_PATH} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
        </svg>
    );
}

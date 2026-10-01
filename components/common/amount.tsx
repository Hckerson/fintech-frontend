import { NOT_AVAILABLE } from "@/lib/constants";
import { formatMoney } from "@/lib/utils/money";

interface Props {
    amountMinor: string;
    currency: string;
    display?: "balance" | "signed";
    label?: string;
    className?: string;
}

export default function Amount({
    amountMinor,
    currency,
    display = "balance",
    label,
    className,
}: Props) {
    const text = formatMoney(amountMinor, currency, {
        signDisplay: display === "signed" ? "exceptZero" : "auto",
    });

    return (
        <data
            value={amountMinor}
            aria-label={label && text ? `${label}: ${text}` : undefined}
            className={className}
        >
            {text ?? <span aria-label={NOT_AVAILABLE}>—</span>}
        </data>
    );
}

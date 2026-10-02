import Amount from "@/components/common/amount";

interface Props {
    currency: string;
    amountMinor: string;
}

export default function PayeeTotal({ currency, amountMinor }: Props) {
    return (
        <span className="text-text text-sm whitespace-nowrap tabular-nums">
            <Amount amountMinor={amountMinor} currency={currency} />{" "}
            <span className="text-text-muted text-xs">{currency}</span>
        </span>
    );
}

"use client";
import dynamic from "next/dynamic";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { PAYEE_SHEET_COPY } from "@/lib/data/payments/payee-sheet-copy";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { PayeePayment } from "@/lib/types";
import { formatMoney, fractionDigits, toMajor } from "@/lib/utils/money";
import { zonedLabel } from "@/lib/utils/zoned-time";

const ChartPlot = dynamic(() => import("@/components/ui/chart-plot"), {
    ssr: false,
    loading: () => (
        <div className="bg-background-muted size-full animate-pulse rounded-lg" />
    ),
});

const TICK = { day: "numeric", month: "short" } as const;

export default function PayeeSpendChart({
    payments,
}: {
    payments: readonly PayeePayment[];
}) {
    const { workspace } = useWorkspace();
    const currency = payments[0]?.currency;
    const series = payments
        .filter((payment) => payment.currency === currency)
        .toReversed();
    const compact = new Intl.NumberFormat(DEFAULT_LOCALE, {
        notation: "compact",
    });

    if (!currency || series.length < 2) return null;

    return (
        <figure className="flex flex-col gap-2">
            <figcaption className="micro-label text-text-muted">
                {PAYEE_SHEET_COPY.chart(currency)}
            </figcaption>
            <div className="h-36">
                <ChartPlot
                    variant="bar"
                    fitted
                    formatTick={(value) => compact.format(value)}
                    points={series.map((payment) => ({
                        label:
                            zonedLabel(
                                payment.paidAt,
                                workspace.timeZone,
                                TICK,
                            ) ?? payment.reference,
                        value: Number(
                            toMajor(
                                BigInt(payment.amountMinor),
                                fractionDigits(currency),
                            ),
                        ),
                        display:
                            formatMoney(payment.amountMinor, currency) ?? "",
                    }))}
                />
            </div>
        </figure>
    );
}

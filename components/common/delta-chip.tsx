import { ArrowDown, ArrowUp, Subtract } from "@carbon/icons-react";
import { DELTA_CEILING_TENTHS } from "@/lib/admin/constants";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { DELTA_COPY } from "@/lib/data/admin/overview";
import type { Delta } from "@/lib/types";
import { deltaRatio } from "@/lib/utils/delta";

interface Props {
    delta: Delta | null;
    comparison: string;
}

const ICONS = { up: ArrowUp, down: ArrowDown, flat: Subtract };

const percent = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "percent",
    maximumFractionDigits: 1,
});

const amountOf = (tenths: number) => {
    if (tenths === 0) return DELTA_COPY.under(percent.format(deltaRatio(1)));
    if (tenths > DELTA_CEILING_TENTHS) {
        return DELTA_COPY.over(percent.format(deltaRatio(DELTA_CEILING_TENTHS)));
    }
    return percent.format(deltaRatio(tenths));
};

export default function DeltaChip({ delta, comparison }: Props) {
    if (!delta) {
        return <p className="text-text-muted text-sm">{DELTA_COPY.none}</p>;
    }

    const Icon = ICONS[delta.direction];
    const text =
        delta.direction === "flat"
            ? DELTA_COPY.flat(comparison)
            : DELTA_COPY[delta.direction](amountOf(delta.tenths), comparison);

    return (
        <p className="text-text-secondary flex items-center gap-2 text-sm">
            <Icon aria-hidden className="size-4 shrink-0" />
            {text}
        </p>
    );
}

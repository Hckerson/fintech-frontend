import { DELTA_CEILING_TENTHS } from "@/lib/admin/constants";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { DELTA_COPY } from "@/lib/data/admin/overview";
import type { Delta } from "@/lib/types";
import { deltaRatio } from "@/lib/utils/delta";

const percent = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "percent",
    maximumFractionDigits: 1,
});

const amountOf = (tenths: number) => {
    if (tenths === 0) return DELTA_COPY.under(percent.format(deltaRatio(1)));
    if (tenths > DELTA_CEILING_TENTHS) {
        return DELTA_COPY.over(
            percent.format(deltaRatio(DELTA_CEILING_TENTHS)),
        );
    }
    return percent.format(deltaRatio(tenths));
};

export const deltaText = (delta: Delta, comparison?: string) => {
    if (comparison === undefined) {
        return delta.direction === "flat"
            ? DELTA_COPY.flat("")
            : amountOf(delta.tenths);
    }
    return delta.direction === "flat"
        ? DELTA_COPY.flat(comparison)
        : DELTA_COPY[delta.direction](amountOf(delta.tenths), comparison);
};

import { DEFAULT_LOCALE } from "@/lib/constants";
import { RUNWAY_COPY } from "@/lib/data/insights/runway";
import type { RunwayResult } from "@/lib/utils/runway";

const dateLabel = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});

export const runwayOutlook = (result: RunwayResult | null) => {
    if (!result) return RUNWAY_COPY.awaiting;
    if (result.months === null) return RUNWAY_COPY.notBurning;
    return result.runsOutOn
        ? RUNWAY_COPY.runsOut(dateLabel.format(result.runsOutOn))
        : RUNWAY_COPY.tooFar;
};

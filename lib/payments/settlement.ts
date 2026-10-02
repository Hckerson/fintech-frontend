import { TRANSFER_CUT_OFF_HOUR } from "@/lib/payments/transfer-constants";

const SATURDAY = 6;

const SUNDAY = 0;

const part = (parts: Intl.DateTimeFormatPart[], type: string) =>
    Number(parts.find((entry) => entry.type === type)?.value);

const isWeekend = (day: Date) =>
    day.getUTCDay() === SATURDAY || day.getUTCDay() === SUNDAY;

export const settlementDay = (now: Date, timeZone: string): string => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);
    const day = new Date(
        Date.UTC(
            part(parts, "year"),
            part(parts, "month") - 1,
            part(parts, "day"),
        ),
    );

    if (part(parts, "hour") >= TRANSFER_CUT_OFF_HOUR || isWeekend(day)) {
        do {
            day.setUTCDate(day.getUTCDate() + 1);
        } while (isWeekend(day));
    }
    return day.toISOString().slice(0, 10);
};

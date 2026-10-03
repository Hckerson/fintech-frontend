import type { ActivityDay, Transaction } from "@/lib/types";
import { zonedLabel } from "@/lib/utils/zoned-time";
import { DEFAULT_TIME_ZONE } from "@/lib/workspace/constants";

const DAY: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
};

export const activityDays = (
    transactions: readonly Transaction[],
    timeZone: string,
): ActivityDay[] =>
    transactions.reduce<ActivityDay[]>((days, transaction) => {
        const date = transaction.postedAt ?? transaction.createdAt;
        const label =
            zonedLabel(
                date,
                transaction.postedAt ? DEFAULT_TIME_ZONE : timeZone,
                DAY,
            ) ?? date;
        const last = days[days.length - 1];

        if (last?.label === label) last.items.push(transaction);
        else days.push({ date, label, items: [transaction] });
        return days;
    }, []);

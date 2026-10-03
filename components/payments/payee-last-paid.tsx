"use client";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";

export default function PayeeLastPaid({
    lastPaidAt,
}: {
    lastPaidAt: string | null;
}) {
    const { workspace } = useWorkspace();
    const day = lastPaidAt
        ? zonedLabel(lastPaidAt, workspace.timeZone, CALENDAR_DAY)
        : null;

    return lastPaidAt && day ? (
        <time dateTime={lastPaidAt} className="whitespace-nowrap">
            {day}
        </time>
    ) : (
        <span className="text-text-muted">{PAYEE_COPY.neverPaid}</span>
    );
}

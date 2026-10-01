"use client";
import { NOT_AVAILABLE } from "@/lib/constants";
import { SHELL_COPY } from "@/lib/data/shell";
import { useMinute } from "@/lib/hooks/use-minute";
import { useOnline } from "@/lib/hooks/use-online";
import { zonedLabel } from "@/lib/utils/zoned-time";
import { BALANCE_STALE_AFTER_MS, MINUTE_MS } from "@/lib/workspace/constants";

interface Props {
    asOf: string;
    timeZone: string;
}

export default function AsOf({ asOf, timeZone }: Props) {
    const minute = useMinute();
    const online = useOnline();
    const delayed =
        minute !== null &&
        minute * MINUTE_MS - new Date(asOf).getTime() > BALANCE_STALE_AFTER_MS;

    return (
        <p className="text-text-muted text-xs">
            {SHELL_COPY.asOf}{" "}
            <time dateTime={asOf}>
                {zonedLabel(asOf, timeZone) ?? NOT_AVAILABLE}
            </time>
            {delayed || !online ? (
                <span className="text-warning">
                    {" · "}
                    {online ? SHELL_COPY.delayed : SHELL_COPY.offlineAsOf}
                </span>
            ) : null}
        </p>
    );
}

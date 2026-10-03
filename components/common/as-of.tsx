"use client";
import clsx from "clsx";
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
    const stale = delayed || !online;

    return (
        <p className="text-text-muted flex items-center gap-2 text-xs">
            <span
                aria-hidden
                className={clsx(
                    "size-1.5 shrink-0 rounded-full",
                    stale ? "bg-warning" : "bg-success",
                )}
            />
            <span>
                {SHELL_COPY.asOf}{" "}
                <time dateTime={asOf}>
                    {zonedLabel(asOf, timeZone) ?? NOT_AVAILABLE}
                </time>
                {stale ? (
                    <span className="text-warning">
                        {" · "}
                        {online ? SHELL_COPY.delayed : SHELL_COPY.offlineAsOf}
                    </span>
                ) : null}
            </span>
        </p>
    );
}

"use client";
import { CloudOffline } from "@carbon/icons-react";
import { SHELL_COPY } from "@/lib/data/shell";
import { useOnline } from "@/lib/hooks/use-online";

export default function OfflineNotice() {
    const online = useOnline();

    return (
        <p
            role="status"
            className={
                online
                    ? "sr-only"
                    : "border-border bg-warning-light text-warning flex items-center gap-2 border-b px-4 py-2 text-xs lg:px-6"
            }
        >
            {online ? null : (
                <>
                    <CloudOffline aria-hidden className="size-4 shrink-0" />
                    {SHELL_COPY.offline}
                </>
            )}
        </p>
    );
}

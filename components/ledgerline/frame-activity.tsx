import clsx from "clsx";
import { DASHBOARD, DASHBOARD_ACTIVITY } from "@/lib/data/ledgerline/dashboard";
import { formatSigned, signOf } from "@/lib/ledgerline/money";

export default function FrameActivity() {
    return (
        <div className="frame-panel flex flex-col">
            <span className="pb-2 text-xs text-text-muted">{DASHBOARD.activityTitle}</span>
            {DASHBOARD_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-t border-border-light py-2.5 text-sm">
                    <span className="min-w-0 flex-1 truncate text-text">{item.name}</span>
                    <span className="hidden text-xs text-text-muted sm:inline">{item.category}</span>
                    <span className="hidden w-16 text-xs text-text-muted sm:inline">{item.date}</span>
                    <span
                        className={clsx(
                            "w-28 text-right tabular-nums",
                            signOf(item.amountMinor) === "in" ? "text-success" : "text-text-secondary",
                        )}
                    >
                        {formatSigned(item.amountMinor)}
                    </span>
                </div>
            ))}
        </div>
    );
}

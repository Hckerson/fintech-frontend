import clsx from "clsx";
import { ChartLineSmooth, Home, Purchase, Report, Send, Wallet, type CarbonIconType } from "@carbon/icons-react";
import { DASHBOARD_NAV } from "@/lib/data/ledgerline/dashboard";
import type { DashboardIcon } from "@/lib/types";

const ICONS: Record<DashboardIcon, CarbonIconType> = {
    home: Home,
    accounts: Wallet,
    payments: Send,
    cards: Purchase,
    treasury: ChartLineSmooth,
    reports: Report,
};

export default function FrameSidebar() {
    return (
        <div className="hidden w-48 shrink-0 flex-col gap-1 border-r border-border p-3 lg:flex">
            {DASHBOARD_NAV.map((item, index) => {
                const Icon = ICONS[item.id];
                return (
                    <span
                        key={item.id}
                        className={clsx(
                            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm",
                            index === 0 ? "bg-background-muted text-text" : "text-text-muted",
                        )}
                    >
                        <Icon className="size-4" />
                        {item.label}
                    </span>
                );
            })}
        </div>
    );
}

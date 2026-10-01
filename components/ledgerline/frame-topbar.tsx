import { Notification, Search } from "@carbon/icons-react";
import { DASHBOARD } from "@/lib/data/ledgerline/dashboard";

export default function FrameTopbar() {
    return (
        <div className="flex h-12 items-center gap-3 border-b border-border px-4">
            <span className="flex size-6 items-center justify-center rounded-md bg-background-muted text-xs font-semibold text-text">
                {DASHBOARD.company.charAt(0)}
            </span>
            <span className="text-sm font-medium text-text">{DASHBOARD.company}</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-caption text-text-muted uppercase">
                {DASHBOARD.companyTag}
            </span>
            <span className="ml-6 hidden h-8 max-w-sm flex-1 items-center gap-2 rounded-md bg-background-muted px-3 text-xs text-text-muted md:flex">
                <Search className="size-3.5" />
                {DASHBOARD.search}
            </span>
            <span className="ml-auto flex items-center gap-3 text-text-muted">
                <Notification className="size-4" />
                <span className="flex size-7 items-center justify-center rounded-full bg-accent-light text-caption font-semibold text-accent">
                    {DASHBOARD.userInitials}
                </span>
            </span>
        </div>
    );
}

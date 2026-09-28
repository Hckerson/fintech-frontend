import { DASHBOARD, DASHBOARD_APPROVALS } from "@/lib/data/ledgerline/dashboard";
import { formatMoney } from "@/lib/ledgerline/money";

export default function FrameApprovals() {
    return (
        <div className="frame-panel flex flex-col gap-3">
            <span className="flex items-center justify-between text-xs text-text-muted">
                {DASHBOARD.approvalsTitle}
                <span className="rounded-full bg-accent-light px-2 py-0.5 text-accent">{DASHBOARD_APPROVALS.length}</span>
            </span>
            {DASHBOARD_APPROVALS.map((approval) => (
                <div key={approval.id} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-muted text-caption font-semibold text-text-secondary">
                        {approval.requester}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm text-text">{approval.payee}</span>
                        <span className="text-xs text-text-muted">
                            {formatMoney(approval.amountMinor, approval.currency)} · {approval.reference}
                        </span>
                    </span>
                    <span className="rounded-md bg-text px-2.5 py-1 text-xs font-medium text-text-inverse">
                        {DASHBOARD.approve}
                    </span>
                </div>
            ))}
        </div>
    );
}

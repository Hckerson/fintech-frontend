import { DASHBOARD, DASHBOARD_ACCOUNTS } from "@/lib/data/ledgerline/dashboard";
import { formatMoney } from "@/lib/ledgerline/money";

export default function FrameAccounts() {
    return (
        <div className="frame-panel flex flex-col gap-3">
            <span className="text-xs text-text-muted">{DASHBOARD.accountsTitle}</span>
            {DASHBOARD_ACCOUNTS.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-text-secondary">
                        <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono text-caption text-text-muted">
                            {account.code}
                        </span>
                        {account.name}
                    </span>
                    <span className="tabular-nums text-text">{formatMoney(account.balanceMinor, account.code)}</span>
                </div>
            ))}
        </div>
    );
}

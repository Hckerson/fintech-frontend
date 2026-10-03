"use client";
import Amount from "@/components/common/amount";
import ErrorState from "@/components/ui/error-state";
import Skeleton from "@/components/ui/skeleton";
import StatusLabel from "@/components/ui/status-label";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { PAYEE_SHEET_COPY } from "@/lib/data/payments/payee-sheet-copy";
import { usePayeeActivity } from "@/lib/hooks/use-payee-activity";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { PAYEE_ACTIVITY_SKELETON_ROWS } from "@/lib/payments/constants";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";

const COPY = PAYEE_SHEET_COPY;

export default function PayeeActivity({ payeeId }: { payeeId: string }) {
    const { workspace } = useWorkspace();
    const activity = usePayeeActivity(payeeId);

    return (
        <section aria-label={COPY.history} className="flex flex-col gap-2">
            <h3 className="micro-label text-text-muted">{COPY.history}</h3>
            {activity.data ? (
                activity.data.items.length === 0 ? (
                    <p className="text-text-muted text-sm">{COPY.noHistory}</p>
                ) : (
                    <ul className="divide-border flex flex-col divide-y">
                        {activity.data.items.map((payment) => (
                            <li
                                key={payment.id}
                                className="flex items-center justify-between gap-3 py-2.5 text-sm"
                            >
                                <span className="flex min-w-0 flex-col">
                                    <span className="text-text truncate">
                                        {payment.reference}
                                    </span>
                                    <time
                                        dateTime={payment.paidAt}
                                        className="text-text-muted text-xs"
                                    >
                                        {zonedLabel(
                                            payment.paidAt,
                                            workspace.timeZone,
                                            CALENDAR_DAY,
                                        )}
                                    </time>
                                </span>
                                <span className="flex shrink-0 items-center gap-2">
                                    {payment.status === "pending" ? (
                                        <StatusLabel
                                            label={COPY.pending}
                                            severity="attention"
                                        />
                                    ) : null}
                                    <Amount
                                        amountMinor={payment.amountMinor}
                                        currency={payment.currency}
                                        className="text-text tabular-nums"
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                )
            ) : activity.error ? (
                <ErrorState
                    kind="retryable"
                    message={COPY.historyFailed}
                    reference={activity.error.reference}
                    onRetry={() => void activity.refetch()}
                    retrying={activity.isFetching}
                />
            ) : (
                <div role="status" aria-busy className="flex flex-col gap-2">
                    <span className="sr-only">{PAYEE_COPY.loading}</span>
                    {Array.from(
                        { length: PAYEE_ACTIVITY_SKELETON_ROWS },
                        (_, row) => (
                            <Skeleton key={row} className="h-10" />
                        ),
                    )}
                </div>
            )}
        </section>
    );
}

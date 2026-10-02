import clsx from "clsx";
import Skeleton from "@/components/ui/skeleton";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { PayeeSummary as Summary } from "@/lib/types";

const ATTENTION: Partial<Record<keyof Summary, string>> = {
    pendingVerification: "bg-warning",
    inProgress: "bg-info",
};

export default function PayeeSummary({ summary }: { summary?: Summary }) {
    return (
        <dl className="border-border bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border lg:grid-cols-4">
            {PAYEE_COPY.stats.map(({ id, label, hint }) => (
                <div
                    key={id}
                    className="bg-background-alt flex flex-col gap-1 p-4"
                >
                    <dt className="micro-label text-text-muted flex items-center gap-2">
                        {summary && summary[id] > 0 && ATTENTION[id] ? (
                            <span
                                aria-hidden
                                className={clsx(
                                    "size-1.5 rounded-full",
                                    ATTENTION[id],
                                )}
                            />
                        ) : null}
                        {label}
                    </dt>
                    <dd className="text-h5 text-text font-medium tabular-nums">
                        {summary ? (
                            summary[id]
                        ) : (
                            <Skeleton className="my-1.5 h-6 w-10" />
                        )}
                    </dd>
                    <dd className="text-text-muted text-xs">{hint}</dd>
                </div>
            ))}
        </dl>
    );
}

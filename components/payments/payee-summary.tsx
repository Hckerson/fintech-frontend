import clsx from "clsx";
import Skeleton from "@/components/ui/skeleton";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { PayeeSummary as Summary } from "@/lib/types";

const DOT: Record<keyof Summary, string> = {
    total: "bg-text-muted",
    active: "bg-success",
    pendingVerification: "bg-warning",
    inProgress: "bg-info",
};

export default function PayeeSummary({ summary }: { summary?: Summary }) {
    return (
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {PAYEE_COPY.stats.map(({ id, label }) => (
                <div key={id} className="flex items-center gap-2">
                    <span
                        aria-hidden
                        className={clsx("size-1.5 rounded-full", DOT[id])}
                    />
                    <dd className="text-text font-medium tabular-nums">
                        {summary ? (
                            summary[id]
                        ) : (
                            <Skeleton className="h-4 w-4" />
                        )}
                    </dd>
                    <dt className="text-text-secondary">{label}</dt>
                </div>
            ))}
        </dl>
    );
}

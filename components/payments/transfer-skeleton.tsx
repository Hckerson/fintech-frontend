import Skeleton from "@/components/ui/skeleton";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { TRANSFER_SKELETON_ROWS } from "@/lib/payments/transfer-constants";

export default function TransferSkeleton() {
    return (
        <div
            role="status"
            aria-busy
            className="grid items-start gap-4 lg:grid-cols-[minmax(0,40rem)_20rem]"
        >
            <span className="sr-only">{TRANSFER_COPY.loading}</span>
            <div className="surface-card flex flex-col gap-4 p-4">
                {Array.from({ length: TRANSFER_SKELETON_ROWS }, (_, row) => (
                    <div key={row} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 rounded-lg" />
                    </div>
                ))}
            </div>
            <div className="surface-card flex flex-col gap-3 p-4">
                {Array.from({ length: TRANSFER_SKELETON_ROWS }, (_, row) => (
                    <Skeleton key={row} className="h-5" />
                ))}
            </div>
        </div>
    );
}

import Skeleton from "@/components/ui/skeleton";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { PAYEE_SKELETON_ROWS } from "@/lib/payments/constants";

export default function PayeeListSkeleton() {
    return (
        <div role="status" aria-busy className="flex flex-col">
            <span className="sr-only">{PAYEE_COPY.loading}</span>
            {Array.from({ length: PAYEE_SKELETON_ROWS }, (_, row) => (
                <div
                    key={row}
                    className="border-border flex items-center gap-3 border-t px-4 py-3 first:border-t-0"
                >
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="ml-auto h-4 w-24 max-md:hidden" />
                    <Skeleton className="h-4 w-24 max-md:hidden" />
                    <Skeleton className="h-8 w-20 max-md:ml-auto" />
                </div>
            ))}
        </div>
    );
}

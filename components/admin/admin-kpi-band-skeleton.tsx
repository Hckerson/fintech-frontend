import Skeleton from "@/components/ui/skeleton";

interface Props {
    part?: "total" | "series";
}

export default function AdminKpiBandSkeleton({ part }: Props) {
    const total = (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-5" />
        </div>
    );
    const series = (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-72" />
            <Skeleton className="h-40" />
            <Skeleton className="h-5" />
        </div>
    );

    if (part === "total") return total;
    if (part === "series") return series;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-8 w-40" />
            </div>
            <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                <div className="surface-card p-4">{total}</div>
                <div className="surface-card p-4">{series}</div>
            </div>
        </div>
    );
}

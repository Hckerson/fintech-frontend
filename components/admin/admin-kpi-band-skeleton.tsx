import Skeleton from "@/components/ui/skeleton";

interface Props {
    part?: "total" | "series";
}

export default function AdminKpiBandSkeleton({ part }: Props) {
    const total = (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-28" />
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-44" />
        </div>
    );
    const series = (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 sm:h-72" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-44" />
        </div>
    );

    if (part === "total") return total;
    if (part === "series") return series;

    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-72" />
            <div className="grid gap-3 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
                <div className="surface-card p-4">{total}</div>
                <div className="surface-card p-4">{series}</div>
            </div>
        </div>
    );
}

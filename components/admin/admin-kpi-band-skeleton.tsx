import Skeleton from "@/components/ui/skeleton";

interface Props {
    part?: "total" | "series";
}

export default function AdminKpiBandSkeleton({ part }: Props) {
    const total = (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20" />
            <Skeleton className="h-4 w-44" />
        </div>
    );
    const series = (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-64 sm:h-72" />
            <Skeleton className="h-16" />
            <Skeleton className="h-4 w-56" />
        </div>
    );

    if (part === "total") return total;
    if (part === "series") return series;

    return (
        <div className="surface-card">
            <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3 lg:px-6">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-8 w-40" />
            </div>
            <div className="divide-border grid divide-y lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
                <div className="p-4 lg:px-6 lg:py-6">{total}</div>
                <div className="p-4 lg:px-6 lg:py-6">{series}</div>
            </div>
        </div>
    );
}

import clsx from "clsx";
import Skeleton from "@/components/ui/skeleton";

interface Props {
    rows?: number;
    rowClassName?: string;
    bare?: boolean;
}

export default function SectionSkeleton({
    rows = 3,
    rowClassName = "h-9",
    bare = false,
}: Props) {
    return (
        <div
            className={clsx("flex flex-col gap-3", !bare && "surface-card p-4")}
        >
            {bare ? null : <Skeleton className="h-5 w-32" />}
            {Array.from({ length: rows }, (_, row) => (
                <Skeleton key={row} className={rowClassName} />
            ))}
        </div>
    );
}

import Skeleton from "@/components/ui/skeleton";
import { ADMIN_USERS_SKELETON_ROWS } from "@/lib/admin/constants";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";

export default function AdminUsersSkeleton() {
    return (
        <div role="status" aria-busy className="flex flex-col">
            <span className="sr-only">{ADMIN_USERS_COPY.loading}</span>
            {Array.from({ length: ADMIN_USERS_SKELETON_ROWS }, (_, row) => (
                <div
                    key={row}
                    className="border-border flex items-center gap-3 border-t px-4 py-3 first:border-t-0"
                >
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-52" />
                    </div>
                    <Skeleton className="ml-auto h-5 w-16 max-md:hidden" />
                    <Skeleton className="h-5 w-20 max-md:hidden" />
                    <Skeleton className="h-4 w-24 max-lg:hidden" />
                    <Skeleton className="size-8 max-md:ml-auto" />
                </div>
            ))}
        </div>
    );
}

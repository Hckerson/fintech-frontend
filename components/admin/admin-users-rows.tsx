"use client";
import AdminUserRow from "@/components/admin/admin-user-row";
import AsOf from "@/components/common/as-of";
import Button from "@/components/ui/button";
import { ADMIN_TIME_ZONE } from "@/lib/admin/constants";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";
import type { AdminUser } from "@/lib/types";
import { formatCount } from "@/lib/utils/admin-stats";

interface Props {
    users: AdminUser[];
    matched: number;
    asOf: string;
    busy: boolean;
    onLoadMore: () => void;
    onCopied: (message: string) => void;
}

const COPY = ADMIN_USERS_COPY;
const HEAD = "px-4 py-2.5 font-medium";

export default function AdminUsersRows({
    users,
    matched,
    asOf,
    busy,
    onLoadMore,
    onCopied,
}: Props) {
    return (
        <>
            <table aria-busy={busy} className="w-full table-fixed text-sm">
                <caption className="sr-only">
                    {COPY.caption(users.length, matched)}
                </caption>
                <thead>
                    <tr className="micro-label bg-background-muted/50 text-text-muted text-left">
                        <th scope="col" className={HEAD}>
                            {COPY.columns.user}
                        </th>
                        <th
                            scope="col"
                            className={`${HEAD} w-32 max-md:hidden`}
                        >
                            {COPY.columns.role}
                        </th>
                        <th
                            scope="col"
                            className={`${HEAD} w-36 max-md:hidden`}
                        >
                            {COPY.columns.status}
                        </th>
                        <th
                            scope="col"
                            className={`${HEAD} w-40 max-lg:hidden`}
                        >
                            {COPY.columns.created}
                        </th>
                        <th scope="col" className={`${HEAD} w-16`}>
                            <span className="sr-only">
                                {COPY.columns.actions}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <AdminUserRow
                            key={user.id}
                            user={user}
                            onCopied={onCopied}
                        />
                    ))}
                </tbody>
            </table>
            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                <p className="text-text-secondary text-xs tabular-nums">
                    {COPY.showing(
                        formatCount(users.length),
                        formatCount(matched),
                    )}
                </p>
                {users.length < matched ? (
                    <Button tone="quiet" size="sm" onClick={onLoadMore}>
                        {COPY.loadMore}
                    </Button>
                ) : null}
                <AsOf asOf={asOf} timeZone={ADMIN_TIME_ZONE} />
            </div>
        </>
    );
}

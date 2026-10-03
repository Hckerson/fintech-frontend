"use client";
import Link from "next/link";
import AdminUserActions from "@/components/admin/admin-user-actions";
import Avatar from "@/components/ui/avatar";
import StatusLabel from "@/components/ui/status-label";
import { ADMIN_TIME_ZONE, adminUserRoute } from "@/lib/admin/constants";
import { NOT_AVAILABLE } from "@/lib/constants";
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from "@/lib/data/admin/users";
import type { AdminUser } from "@/lib/types";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";

interface Props {
    user: AdminUser;
    onCopied: (message: string) => void;
}

const CELL = "px-4 py-3";

export default function AdminUserRow({ user, onCopied }: Props) {
    const created = zonedLabel(user.createdAt, ADMIN_TIME_ZONE, CALENDAR_DAY);

    return (
        <tr className="border-border hover:bg-background-muted/40 border-t align-middle transition-colors">
            <th scope="row" className={`${CELL} max-w-0 text-left font-normal`}>
                <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={user.fullName} className="size-8" />
                    <span className="flex min-w-0 flex-col">
                        <Link
                            href={adminUserRoute(user.id)}
                            className="text-text focus-visible:outline-accent truncate font-medium underline-offset-4 hover:underline focus-visible:outline-2"
                        >
                            {user.fullName}
                        </Link>
                        <span className="text-text-muted truncate text-xs">
                            {user.email}
                        </span>
                        <span className="flex flex-wrap gap-2 pt-1 md:hidden">
                            <StatusLabel {...USER_ROLE_LABELS[user.role]} />
                            <StatusLabel {...USER_STATUS_LABELS[user.status]} />
                        </span>
                    </span>
                </span>
            </th>
            <td className={`${CELL} max-md:hidden`}>
                <StatusLabel {...USER_ROLE_LABELS[user.role]} />
            </td>
            <td className={`${CELL} max-md:hidden`}>
                <StatusLabel {...USER_STATUS_LABELS[user.status]} />
            </td>
            <td
                className={`${CELL} text-text-secondary whitespace-nowrap tabular-nums max-lg:hidden`}
            >
                <time dateTime={user.createdAt}>
                    {created ?? NOT_AVAILABLE}
                </time>
            </td>
            <td className={`${CELL} w-px`}>
                <AdminUserActions user={user} onCopied={onCopied} />
            </td>
        </tr>
    );
}

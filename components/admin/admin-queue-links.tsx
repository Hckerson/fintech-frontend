import Link from "next/link";
import { ChevronRight } from "@carbon/icons-react";
import AdminNavIcon from "@/components/admin/admin-nav-icon";
import SectionCard from "@/components/common/section-card";
import { ADMIN_ROUTE } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { adminNavFor, platformRoleOf } from "@/lib/utils/platform-role";
import { getSession } from "@/lib/utils/session";

const COPY = ADMIN_OVERVIEW_COPY.queues;

export default async function AdminQueueLinks() {
    const role = platformRoleOf(await getSession());
    const queues = role
        ? adminNavFor(role).filter((item) => item.href !== ADMIN_ROUTE)
        : [];

    if (queues.length === 0) return null;

    return (
        <SectionCard title={COPY.title}>
            <ul className="divide-border -my-1 flex flex-col divide-y">
                {queues.map((queue) => (
                    <li key={queue.id}>
                        <Link
                            href={queue.href}
                            className="group focus-visible:outline-accent flex items-center gap-3 rounded-md py-3 focus-visible:outline-2"
                        >
                            <span className="bg-accent-light text-accent flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <AdminNavIcon icon={queue.icon} />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col">
                                <span className="text-text text-sm font-medium">
                                    {queue.label}
                                </span>
                                <span className="text-text-muted text-xs">
                                    {
                                        COPY.detail[
                                            queue.id as keyof typeof COPY.detail
                                        ]
                                    }
                                </span>
                            </span>
                            <ChevronRight
                                aria-hidden
                                className="text-text-muted group-hover:text-text size-4 shrink-0"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </SectionCard>
    );
}

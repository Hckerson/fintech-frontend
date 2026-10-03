import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import AdminNavIcon from "@/components/admin/admin-nav-icon";
import { ADMIN_ROUTE } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { adminNavFor, platformRoleOf } from "@/lib/utils/platform-role";
import { getSession } from "@/lib/utils/session";

const COPY = ADMIN_OVERVIEW_COPY.queues;
const TITLE_ID = "admin-queues-title";

export default async function AdminQueueLinks() {
    const role = platformRoleOf(await getSession());
    const queues = role
        ? adminNavFor(role).filter((item) => item.href !== ADMIN_ROUTE)
        : [];

    if (queues.length === 0) return null;

    return (
        <section aria-labelledby={TITLE_ID} className="flex flex-col gap-3">
            <h2 id={TITLE_ID} className="text-text text-base font-medium">
                {COPY.title}
            </h2>
            <ul className="grid gap-3 md:grid-cols-3">
                {queues.map((queue) => (
                    <li key={queue.id}>
                        <Link
                            href={queue.href}
                            className="group surface-card hover:border-border-dark focus-visible:outline-accent flex h-full items-center gap-3 p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <span className="bg-accent-light text-accent flex size-9 shrink-0 items-center justify-center rounded-lg">
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
                            <ArrowRight
                                aria-hidden
                                className="text-text-muted group-hover:text-accent size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

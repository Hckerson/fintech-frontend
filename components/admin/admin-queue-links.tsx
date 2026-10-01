import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import { ADMIN_ROUTE } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { adminNavFor, platformRoleOf } from "@/lib/utils/platform-role";
import { getSession } from "@/lib/utils/session";

export default async function AdminQueueLinks() {
    const role = platformRoleOf(await getSession());
    const queues = role
        ? adminNavFor(role).filter((item) => item.href !== ADMIN_ROUTE)
        : [];

    if (queues.length === 0) return null;

    return (
        <nav aria-label={ADMIN_OVERVIEW_COPY.queues}>
            <ul className="flex flex-wrap gap-2">
                {queues.map((queue) => (
                    <li key={queue.id}>
                        <Link
                            href={queue.href}
                            className="border-border-dark text-text hover:border-text-secondary hover:bg-background-muted focus-visible:outline-accent inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            {queue.label}
                            <ArrowRight aria-hidden className="size-4" />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

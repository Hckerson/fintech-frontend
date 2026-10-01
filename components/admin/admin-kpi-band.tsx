"use client";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import AdminUserSeries from "@/components/admin/admin-user-series";
import AdminUserTotal from "@/components/admin/admin-user-total";
import Tabs from "@/components/ui/tabs";
import { ADMIN_RANGE_PARAM } from "@/lib/admin/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import type { StatsPeriod } from "@/lib/types";
import { queryString } from "@/lib/utils/query-string";

const COPY = ADMIN_OVERVIEW_COPY.growth;

export default function AdminKpiBand({ period: initial }: { period: StatsPeriod }) {
    const pathname = usePathname();
    const titleId = useId();
    const panelId = useId();
    const [period, setPeriod] = useState(initial);

    const select = (next: StatsPeriod) => {
        setPeriod(next);
        window.history.replaceState(
            null,
            "",
            `${pathname}${queryString({ [ADMIN_RANGE_PARAM]: next })}`,
        );
    };

    return (
        <section aria-labelledby={titleId} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h2 id={titleId} className="text-text text-lg font-medium">
                        {COPY.title}
                    </h2>
                    <p className="text-text-muted text-xs">{COPY.zone}</p>
                </div>
                <Tabs
                    label={COPY.periodLabel}
                    tabs={COPY.periods}
                    value={period}
                    onChange={select}
                    panelId={panelId}
                />
            </div>
            <div
                id={panelId}
                role="tabpanel"
                aria-labelledby={titleId}
                className="grid gap-3 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
            >
                <div className="surface-card p-4">
                    <AdminUserTotal period={period} />
                </div>
                <div className="surface-card min-w-0 p-4">
                    <AdminUserSeries period={period} />
                </div>
            </div>
        </section>
    );
}

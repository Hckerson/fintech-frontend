"use client";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import AdminUserSeries from "@/components/admin/admin-user-series";
import AdminUserTotal from "@/components/admin/admin-user-total";
import SectionCard from "@/components/common/section-card";
import Tabs from "@/components/ui/tabs";
import { ADMIN_RANGE_PARAM } from "@/lib/admin/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import type { StatsPeriod } from "@/lib/types";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    period: StatsPeriod;
    aside?: ReactNode;
}

const COPY = ADMIN_OVERVIEW_COPY;

export default function AdminKpiBand({ period: initial, aside }: Props) {
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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-x-3">
                    <h2
                        id={titleId}
                        className="text-text text-base font-medium"
                    >
                        {COPY.growth.title}
                    </h2>
                    <p className="text-text-muted text-xs">
                        {COPY.growth.zone}
                    </p>
                </div>
                <Tabs
                    label={COPY.growth.periodLabel}
                    tabs={COPY.growth.periods}
                    value={period}
                    onChange={select}
                    panelId={panelId}
                />
            </div>
            <div
                id={panelId}
                role="tabpanel"
                aria-labelledby={titleId}
                className="grid items-start gap-3 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
            >
                <div className="flex min-w-0 flex-col gap-3">
                    <SectionCard title={COPY.total.title}>
                        <AdminUserTotal period={period} />
                    </SectionCard>
                    {aside}
                </div>
                <SectionCard title={COPY.series.title[period]}>
                    <AdminUserSeries period={period} />
                </SectionCard>
            </div>
        </section>
    );
}

"use client";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import AdminSeriesFigures from "@/components/admin/admin-series-figures";
import AdminUserSeries from "@/components/admin/admin-user-series";
import AdminUserTotal from "@/components/admin/admin-user-total";
import Tabs from "@/components/ui/tabs";
import { ADMIN_RANGE_PARAM } from "@/lib/admin/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import type { StatsPeriod } from "@/lib/types";
import { queryString } from "@/lib/utils/query-string";

interface Props {
    period: StatsPeriod;
    aside?: ReactNode;
}

const COPY = ADMIN_OVERVIEW_COPY.growth;

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
        <>
            <section
                aria-labelledby={titleId}
                className="surface-card relative overflow-hidden"
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 -left-32 size-96 bg-[radial-gradient(50%_50%_at_50%_50%,var(--ledger-glow),transparent_72%)]"
                />
                <div className="border-border relative flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 lg:px-6">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                        <h2
                            id={titleId}
                            className="text-text text-base font-medium"
                        >
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
                    className="divide-border relative grid divide-y lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:divide-x lg:divide-y-0"
                >
                    <div className="flex min-w-0 flex-col gap-3 p-4 lg:px-6 lg:py-6">
                        <AdminUserTotal period={period} />
                        <AdminSeriesFigures period={period} />
                    </div>
                    <div className="min-w-0 p-4 lg:px-6 lg:py-6">
                        <AdminUserSeries period={period} />
                    </div>
                </div>
            </section>
            {aside}
        </>
    );
}

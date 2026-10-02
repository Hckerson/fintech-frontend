import type { Metadata } from "next";
import AdminKpiBand from "@/components/admin/admin-kpi-band";
import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import AdminQueueLinks from "@/components/admin/admin-queue-links";
import PageHeader from "@/components/shell/page-header";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import { adminStatsSearchParamsSchema } from "@/lib/validations/admin-stats";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: ADMIN_OVERVIEW_COPY.metaTitle };

export default async function AdminOverviewPage({ searchParams }: Props) {
    const { range } = adminStatsSearchParamsSchema.parse(await searchParams);

    return (
        <>
            <PageHeader title={PAGE_TITLES.adminOverview} />
            <SectionErrorBoundary skeleton={<AdminKpiBandSkeleton />}>
                <AdminKpiBand period={range} aside={<AdminQueueLinks />} />
            </SectionErrorBoundary>
        </>
    );
}

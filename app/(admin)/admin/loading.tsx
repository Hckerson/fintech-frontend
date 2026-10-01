import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";

export default function AdminOverviewLoading() {
    return (
        <>
            <PageHeader
                eyebrow={ADMIN_OVERVIEW_COPY.eyebrow}
                title={PAGE_TITLES.adminOverview}
                lead={ADMIN_OVERVIEW_COPY.lead}
            />
            <AdminKpiBandSkeleton />
        </>
    );
}

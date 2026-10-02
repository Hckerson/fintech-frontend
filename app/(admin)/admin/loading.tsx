import AdminKpiBandSkeleton from "@/components/admin/admin-kpi-band-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";

export default function AdminOverviewLoading() {
    return (
        <>
            <PageHeader title={PAGE_TITLES.adminOverview} />
            <AdminKpiBandSkeleton />
        </>
    );
}

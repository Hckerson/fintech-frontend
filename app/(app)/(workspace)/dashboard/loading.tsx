import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";

export default function DashboardLoading() {
    return (
        <>
            <PageHeader title={PAGE_TITLES.dashboard} />
            <DashboardSkeleton />
        </>
    );
}

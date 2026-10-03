import SectionSkeleton from "@/components/common/section-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";

export default function AccountsLoading() {
    return (
        <>
            <PageHeader title={PAGE_TITLES.accounts} />
            <div aria-busy>
                <SectionSkeleton rows={6} />
            </div>
        </>
    );
}

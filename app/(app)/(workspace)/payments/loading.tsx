import PayeeListSkeleton from "@/components/payments/payee-list-skeleton";
import PayeeSummary from "@/components/payments/payee-summary";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";

export default function PaymentsLoading() {
    return (
        <>
            <PageHeader
                eyebrow={PAYEE_COPY.eyebrow}
                title={PAGE_TITLES.payments}
            />
            <PayeeSummary />
            <div className="surface-card">
                <PayeeListSkeleton />
            </div>
        </>
    );
}

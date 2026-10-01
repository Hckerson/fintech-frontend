import PayeeListSkeleton from "@/components/payments/payee-list-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";

export default function PaymentsLoading() {
    return (
        <>
            <PageHeader
                eyebrow={PAYEE_COPY.eyebrow}
                title={PAGE_TITLES.payments}
                lead={PAYEE_COPY.lead}
            />
            <PayeeListSkeleton />
        </>
    );
}

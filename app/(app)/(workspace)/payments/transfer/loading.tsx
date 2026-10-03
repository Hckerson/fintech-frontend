import TransferSkeleton from "@/components/payments/transfer-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";

export default function TransferLoading() {
    return (
        <>
            <PageHeader title={PAGE_TITLES.transfer} />
            <TransferSkeleton />
        </>
    );
}

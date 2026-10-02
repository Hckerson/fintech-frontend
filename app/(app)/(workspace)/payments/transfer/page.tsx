import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TransferFlow from "@/components/payments/transfer-flow";
import TransferSkeleton from "@/components/payments/transfer-skeleton";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { serverEnv } from "@/lib/utils/server-env";
import { transferSearchParamsSchema } from "@/lib/validations/transfers";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: PAGE_TITLES.transfer };

export const dynamic = "force-dynamic";

export default async function TransferPage({ searchParams }: Props) {
    if (!serverEnv.moneyMovement) notFound();

    const { payeeId } = transferSearchParamsSchema.parse(await searchParams);

    return (
        <SectionErrorBoundary skeleton={<TransferSkeleton />}>
            <TransferFlow payeeId={payeeId} />
        </SectionErrorBoundary>
    );
}

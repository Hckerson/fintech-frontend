import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PayeeList from "@/components/payments/payee-list";
import PayeeListSkeleton from "@/components/payments/payee-list-skeleton";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { serverEnv } from "@/lib/utils/server-env";

export const metadata: Metadata = { title: PAGE_TITLES.payments };

export const dynamic = "force-dynamic";

export default function PaymentsPage() {
    if (!serverEnv.moneyMovement) notFound();

    return (
        <SectionErrorBoundary skeleton={<PayeeListSkeleton />}>
            <PayeeList />
        </SectionErrorBoundary>
    );
}

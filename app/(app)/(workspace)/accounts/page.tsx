import type { Metadata } from "next";
import SectionSkeleton from "@/components/common/section-skeleton";
import AccountDirectory from "@/components/ledger/account-directory";
import AccountsHeader from "@/components/ledger/accounts-header";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { parseAccountsParams } from "@/lib/validations/accounts";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: PAGE_TITLES.accounts };

export default async function AccountsPage({ searchParams }: Props) {
    const params = parseAccountsParams(await searchParams);

    return (
        <>
            <AccountsHeader />
            <SectionErrorBoundary skeleton={<SectionSkeleton rows={6} />}>
                <AccountDirectory {...params} />
            </SectionErrorBoundary>
        </>
    );
}

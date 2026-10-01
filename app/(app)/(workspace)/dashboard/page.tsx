import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardVariant from "@/components/dashboard/dashboard-variant";
import { PAGE_TITLES } from "@/lib/constants";
import { parseDashboardParams } from "@/lib/validations/dashboard-params";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: PAGE_TITLES.dashboard };

export default async function DashboardPage({ searchParams }: Props) {
    const params = parseDashboardParams(await searchParams);

    return (
        <>
            <DashboardHeader />
            <DashboardVariant {...params} />
        </>
    );
}

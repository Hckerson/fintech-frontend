import type { Metadata } from "next";
import DashboardData from "@/components/dashboard/dashboard-data";
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
        <DashboardData>
            <DashboardHeader />
            <DashboardVariant {...params} />
        </DashboardData>
    );
}

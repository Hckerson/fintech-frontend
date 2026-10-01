import { DASHBOARD_PARAMS } from "@/lib/dashboard/constants";
import type { DashboardParams } from "@/lib/types";
import { dashboardSearchParamsSchema } from "@/lib/validations/dashboard";

export const parseDashboardParams = (
    raw: Record<string, string | string[] | undefined>,
): DashboardParams => {
    const params = dashboardSearchParamsSchema.parse(raw);

    return {
        ...params,
        dropped: DASHBOARD_PARAMS.filter(
            (name) => raw[name] !== undefined && raw[name] !== params[name],
        ),
    };
};
